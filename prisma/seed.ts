import { PrismaClient, OrderChannel, OrderStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { productSeeds } from "../src/content/products";
import { journalSeeds } from "../src/content/journal";

const prisma = new PrismaClient();

async function main() {
  console.log("[seed] 상품 데이터 생성...");
  const products = [];
  for (const [i, p] of productSeeds.entries()) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        variety: p.variety,
        weightLabel: p.weightLabel,
        weightGrams: p.weightGrams,
        price: p.price,
        compareAt: p.compareAt,
        shippingFee: p.shippingFee,
        stock: p.stock,
        shortDescription: p.shortDescription,
        description: p.description,
        sortOrder: i,
      },
    });
    products.push(product);
  }

  console.log("[seed] 저널 포스트 생성...");
  for (const j of journalSeeds) {
    await prisma.journalPost.upsert({
      where: { slug: j.slug },
      update: {},
      create: j,
    });
  }

  console.log("[seed] 관리자 계정 생성...");
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@damifarm.kr";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? "ChangeMe!2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "담이농장 관리자",
      role: "admin",
    },
  });

  const existingOrders = await prisma.unifiedOrder.count();
  if (existingOrders === 0 && products[0] && products[1]) {
    console.log("[seed] 운영 데모용 샘플 주문/고객 생성 (실서비스 전 삭제 권장)...");
    const customer1 = await prisma.customer.create({
      data: { name: "김민지", phone: "010-1234-5678", address: "서울특별시 강남구 테헤란로 123" },
    });
    const customer2 = await prisma.customer.create({
      data: { name: "박준호", phone: "010-2345-6789", address: "경기도 성남시 분당구 판교로 45" },
    });

    await prisma.unifiedOrder.create({
      data: {
        channel: OrderChannel.WEB,
        customerId: customer1.id,
        recipientName: customer1.name,
        recipientPhone: customer1.phone,
        address: customer1.address!,
        itemsAmount: products[1].price,
        shippingAmount: products[1].shippingFee,
        totalAmount: products[1].price + products[1].shippingFee,
        status: OrderStatus.PREPARING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: "card",
        items: {
          create: [
            {
              productId: products[1].id,
              nameSnapshot: products[1].name,
              weightLabelSnapshot: products[1].weightLabel,
              unitPrice: products[1].price,
              quantity: 1,
            },
          ],
        },
      },
    });

    await prisma.unifiedOrder.create({
      data: {
        channel: OrderChannel.PHONE,
        customerId: customer2.id,
        recipientName: customer2.name,
        recipientPhone: customer2.phone,
        address: customer2.address!,
        itemsAmount: products[0].price * 2,
        shippingAmount: products[0].shippingFee,
        totalAmount: products[0].price * 2 + products[0].shippingFee,
        status: OrderStatus.SHIPPING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: "bank_transfer",
        trackingCarrier: "CJ대한통운",
        trackingNumber: "123456789012",
        shippedAt: new Date(),
        items: {
          create: [
            {
              productId: products[0].id,
              nameSnapshot: products[0].name,
              weightLabelSnapshot: products[0].weightLabel,
              unitPrice: products[0].price,
              quantity: 2,
            },
          ],
        },
      },
    });
  }

  console.log("[seed] 완료");
  console.log(`[seed] 관리자 로그인: ${adminEmail} / ${process.env.ADMIN_INITIAL_PASSWORD ? "(.env 설정값)" : "ChangeMe!2026 (반드시 변경하세요)"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
