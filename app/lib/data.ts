//import { Products, ProductImage, NutritionalInfo } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { fetchDashboardSearchProductProps, OptionProps } from "@/app/lib/definitions";

const prisma = new PrismaClient();

export async function fetchAllProducts() {
  noStore();
  try {
    console.log("Fetching All Products data...");

    //await new Promise((resolve) => setTimeout(resolve, 1000));
    const products = await prisma.product.findMany({
      orderBy: [
        {
          recommend: "asc",
        },
      ],
      select: {
        id: true,
        productId: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            thumbnailUrl: true,
          },
        },
        price: true,
        recommend: true,
      },
    });

    return products;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products data.");
  }
}

export async function fetchFilteredProducts(query: string, category: string, price: number, options: string) {
  noStore();
  try {
    let where: any = {};

    if (query) {
      where = {
        ...where,
        name: {
          contains: query,
        },
      };
    }

    if (category) {
      where = {
        ...where,
        categoryId: category,
      };
    }

    if (price) {
      where = {
        ...where,
        price: {
          lte: price,
        },
      };
    }

    if (options) {
      const optionFilters = options.split(",").map((option) => {
        let filter: any = {};
        filter[option] = true;
        return filter;
      });
      where = {
        ...where,
        option: {
          AND: optionFilters,
        },
      };
    }

    const queries = {
      where,
      select: {
        productId: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            thumbnailUrl: true,
          },
        },
        price: true,
        option: true,
      },
    };

    const [products, total] = await prisma.$transaction([prisma.product.findMany(queries), prisma.product.count()]);
    return { products, total };
  } catch (error) {
    console.error("Fetch Search Filter Error:", error);
    throw new Error("Failed to Search.");
  }
}

export async function fetchAProductDetail(productid: string) {
  noStore();
  try {
    const product = await prisma.product.findUnique({
      where: {
        productId: productid,
      },
      select: {
        productId: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
        description: true,
        images: {
          select: {
            thumbnailUrl: true,
            imageUrl_1: true,
            imageUrl_2: true,
            imageUrl_3: true,
            imageUrl_4: true,
            imageUrl_5: true,
            imageUrl_6: true,
          },
        },
        price: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Faild to a get the Product Data Error:", error);
    throw new Error("Faild to a Product Data.");
  }
}

export async function fetchCategory() {
  noStore();
  try {
    const category = await prisma.category.findMany();

    console.log("Fetch Category completed.");
    //console.log(products[0].images[0].thumbnailUrl);
    return category;
  } catch (error) {
    console.error("Fetch Category Error:", error);
    throw new Error("Failed to fetch Category.");
  }
}

export async function fetchNutritionalInfo(productid: string) {
  noStore();
  try {
    const nutritional = await prisma.nutritionalInfo.findUnique({
      where: {
        productId: productid,
      },
    });
    console.log("Fetch NutritionalInfo Completed.");
    //console.log(products[0].images[0].thumbnailUrl);
    return nutritional;
  } catch (error) {
    console.error("Fetch NutritionalInfo Error:", error);
    throw new Error("Failed to fetch NutritionalInfo.");
  }
}

export async function fetchDashboardSearchProducts(productid: string) {
  noStore();
  try {
    const product = await prisma.product.findUnique({
      where: {
        productId: productid,
      },
      select: {
        productId: true,
        name: true,
        price: true,
        description: true,
        images: {
          select: {
            thumbnailUrl: true,
            imageUrl_1: true,
            imageUrl_2: true,
            imageUrl_3: true,
            imageUrl_4: true,
            imageUrl_5: true,
            imageUrl_6: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        option: {
          select: {
            takeoutAvailable: true,
            seasonal: true,
            bulkPurchase: true,
            couponAvailable: true,
          },
        },
      },
    });
    return product as fetchDashboardSearchProductProps;
  } catch (error) {
    console.error("Faild to a get the Product Data Error:", error);
    throw new Error("Faild to a Product Data.");
  }
}

export async function fetchOptions(productid: string) {
  noStore();
  try {
    const option = await prisma.option.findUnique({
      where: {
        productId: productid,
      },
      select: {
        takeoutAvailable: true,
        seasonal: true,
        bulkPurchase: true,
        couponAvailable: true,
      },
    });
    console.log("Fetch NutritionalInfo Completed.");
    //console.log(products[0].images[0].thumbnailUrl);
    return option;
  } catch (error) {
    console.error("Fetch NutritionalInfo Error:", error);
    throw new Error("Failed to fetch NutritionalInfo.");
  }
}

// プロセス終了時に Prisma Client の接続を閉じる
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
