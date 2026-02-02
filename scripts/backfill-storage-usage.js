/* scripts/backfill-storage-usage.js */

const { PrismaClient } = require("@prisma/client");
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");

const prisma = new PrismaClient();
const s3 = new S3Client({ region: process.env.AWS_REGION });

async function getFileSize(bucket, key) {
  try {
    const res = await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return res.ContentLength || 0;
  } catch (err) {
    console.warn(`⚠️ Skipping missing file: ${key}`);
    return 0;
  }
}

async function main() {
  const bucket = process.env.S3_BUCKET;

  if (!bucket) {
    throw new Error("S3_BUCKET_NAME is not set");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      documents: {
        select: { filePath: true },
      },
    },
  });

  console.log(`Found ${users.length} users`);

  for (const user of users) {
    let totalBytes = BigInt(0);

    for (const doc of user.documents) {
      if (!doc.filePath) continue;

      const size = await getFileSize(bucket, doc.filePath);
      totalBytes += BigInt(size);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        storageUsedBytes: totalBytes,
      },
    });

    console.log(
      `✅ ${user.email}: ${Number(totalBytes) / (1024 * 1024)} MB`
    );
  }

  console.log("🎉 Storage backfill complete");
}

main()
  .catch(err => {
    console.error("❌ Backfill failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
