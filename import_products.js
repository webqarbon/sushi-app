const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const slugify = require('slugify');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
    const products = [];
    const categories = new Set();

    let firstRowLogged = false;

    // Read and parse CSV
    fs.createReadStream('prom_products_v2.csv')
        .pipe(csv({
            mapHeaders: ({ header }) => header.replace(/[\ufeff\u200b\u200e\u200f]/g, '').trim()
        }))
        .on('data', (row) => {
            // Mapping: Категорія, Назва товару, Ціна, Фото
            const categoryName = row['Категорія'];
            const productName = row['Назва товару'];
            const price = parseFloat(row['Ціна']);
            const imageUrl = row['Фото'];

            if (categoryName && productName) {
                categories.add(categoryName);
                products.push({
                    categoryName,
                    name: productName,
                    price,
                    image_url: imageUrl
                });
            }
        })
        .on('end', async () => {
            console.log(`Parsed ${products.length} products and ${categories.size} categories.`);

            // 1. Clear existing products and categories if you want a fresh start
            // Careful: This will delete everything in these tables!
            console.log('Cleaning existing products and categories...');
            await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            // 2. Insert Categories
            const categoryData = Array.from(categories).map((name, index) => ({
                name,
                slug: slugify(name, { lower: true, locale: 'uk' }) || name.toLowerCase().replace(/ /g, '-'),
                order_index: index * 10
            }));

            console.log('Inserting categories...');
            const { data: insertedCategories, error: catError } = await supabase
                .from('categories')
                .insert(categoryData)
                .select();

            if (catError) {
                console.error('Error inserting categories:', catError);
                return;
            }

            console.log(`Inserted ${insertedCategories.length} categories.`);

            // Create mapping name -> id
            const categoryMap = {};
            insertedCategories.forEach(c => {
                categoryMap[c.name] = c.id;
            });

            // 3. Insert Products
            const productData = products.map(p => {
                // Try to extract weight (e.g., "500 г", "1 кг", "100 шт") from name
                const weightMatch = p.name.match(/\d+\s*(г|кг|мл|л|шт)/i);
                const description = weightMatch ? weightMatch[0] : '';

                return {
                    category_id: categoryMap[p.categoryName],
                    name: p.name,
                    price: p.price,
                    image_url: p.image_url,
                    description: description,
                    bonus_percent: 5,
                    fake_rating: 4.8,
                    fake_reviews_count: 124
                };
            });

            console.log('Inserting products...');
            // Batch insert in chunks to avoid large request error
            const chunkSize = 100;
            for (let i = 0; i < productData.length; i += chunkSize) {
                const chunk = productData.slice(i, i + chunkSize);
                const { error: prodError } = await supabase
                    .from('products')
                    .insert(chunk);
                
                if (prodError) {
                    console.error(`Error inserting products chunk starting at ${i}:`, prodError);
                } else {
                    console.log(`Inserted chunk of products: ${i + chunk.length} / ${productData.length}`);
                }
            }

            console.log('Import finished successfully!');
        });
}

importData();
