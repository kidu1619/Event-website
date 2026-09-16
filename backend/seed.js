const mongoose = require('mongoose');
require('dotenv').config();

const Vendor = require('./models/Vendor');
const Inspiration = require('./models/Inspiration');
const Board = require('./models/Board');
const Inquiry = require('./models/Inquiry');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_platform_db';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Vendor.deleteMany({});
        await Inspiration.deleteMany({});
        await Board.deleteMany({});
        await Inquiry.deleteMany({});
        await Review.deleteMany({});

        console.log('Cleared existing collections.');

        // 1. Seed Curated Vendors (Decor & Media focus for V1)
        const vendorsData = [
            {
                name: 'AURA Luxury Event Scenography',
                slug: 'aura-luxury-decor',
                category: 'Decor',
                subcategories: ['Modern Luxury', 'Floral Architecture', 'Grand Stage Design'],
                tagline: 'High-concept spatial transformations & modern luxury celebrations',
                bio: 'AURA is an elite Addis Ababa-based event scenography atelier specializing in lavish destination weddings, monumental botanical installations, and sophisticated corporate galas. With over 8 years of styling high-profile events across Addis Ababa, our team blends architectural discipline with ethereal floral art.',
                location: 'Addis Ababa (Bole Atlas)',
                address: 'Namibia St, Bole Atlas, Addis Ababa',
                rating: 4.9,
                reviewsCount: 38,
                isVerified: true,
                badge: 'Premier Admin Curated',
                contactPhone: '+251 91 123 4567',
                contactEmail: 'hello@aurascenography.et',
                instagram: '@aura_events_addis',
                telegram: '@aura_decor_official',
                website: 'https://aura-scenography.et',
                priceRange: '$$$$',
                startingPrice: '120,000 ETB',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
                portfolioImages: [
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
                ],
                specialties: ['Curated Floral Canopies', 'Crystal Chandelier Ceiling Grids', 'Sculptural Couple Stages', 'Ambient Mood Lighting'],
                packages: [
                    {
                        name: 'Signature Grand Ballroom Decor',
                        price: '280,000 ETB',
                        features: ['Custom 3D Backdrop Stage', 'Imported Floral Runway & Tablescapes', 'Mood Uplighting (32 Heads)', 'Ceiling Drapes & Hanging Installations', 'Full 3D Render Preview']
                    },
                    {
                        name: 'Modern Intimate Celebration',
                        price: '140,000 ETB',
                        features: ['Centerpiece Botanical Runners', 'Bespoke Welcome Archway', 'Cake Display Scenography', 'Ambient Candle Wall']
                    }
                ],
                experienceYears: 8,
                completedEvents: 240
            },
            {
                name: 'Zema Traditional Melse Masters',
                slug: 'zema-melse-masters',
                category: 'Decor',
                subcategories: ['Traditional Melse', 'Cultural Heritage', 'Royal Habesha Themes'],
                tagline: 'Authentic royal Melse decor with heritage gold accents & woven tapestry',
                bio: 'Preserving and elevating Ethiopian heritage through breathtaking Melse styling. From hand-carved royal chairs (Zufan) to gold-embroidered Tilet draperies, ceremonial coffee corners, and vibrant cultural lighting, Zema crafts unforgettable cultural celebrations with contemporary luxury.',
                location: 'Addis Ababa (Kazanchis)',
                address: 'Menelik II Ave, Kazanchis, Addis Ababa',
                rating: 5.0,
                reviewsCount: 54,
                isVerified: true,
                badge: 'Royal Heritage Master',
                contactPhone: '+251 92 345 6789',
                contactEmail: 'contact@zemamelse.et',
                instagram: '@zema_melse_decor',
                telegram: '@zemamelse',
                priceRange: '$$$',
                startingPrice: '95,000 ETB',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
                portfolioImages: [
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1545232979-fbf6c167d3fc?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80'
                ],
                specialties: ['Royal Golden Zufan Stages', 'Traditional Mesob Arrangements', 'Bespoke Ethiopian Coffee Ceremony Pavilions', 'Tilet Patterned Light Displays'],
                packages: [
                    {
                        name: 'Royal Heritage Melse Suite',
                        price: '190,000 ETB',
                        features: ['Full Velvet & Gold Zufan Stage', 'Traditional Woven Ceiling Tapestry', 'Curated Coffee & Tej Station', 'Custom Habesha Welcome Gate', 'Authentic Cultural Lighting']
                    }
                ],
                experienceYears: 6,
                completedEvents: 180
            },
            {
                name: 'Liyu Cinema & Wedding Films',
                slug: 'liyu-cinema-media',
                category: 'Media',
                subcategories: ['Cinematic Film', 'Drone Videography', 'Same-Day Edit'],
                tagline: 'Emotion-driven 4K cinematic wedding films and editorial event coverage',
                bio: 'Liyu Cinema is Ethiopia’s premier visual storytelling studio. We capture the unscripted magic, tears of joy, and grand festive energy through Netflix-grade RED/Sony cinema cameras, FPV drone sweeps, and emotional cinematic color grading.',
                location: 'Addis Ababa (Old Airport)',
                address: 'Roosevelt St, Old Airport, Addis Ababa',
                rating: 4.9,
                reviewsCount: 42,
                isVerified: true,
                badge: 'Master Cinematographer',
                contactPhone: '+251 94 456 7890',
                contactEmail: 'bookings@liyucinema.com',
                instagram: '@liyu_cinema',
                telegram: '@liyucinema_official',
                priceRange: '$$$$',
                startingPrice: '110,000 ETB',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=80',
                portfolioImages: [
                    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'
                ],
                specialties: ['4K Multi-Camera Cinema', 'Same-Day Reception Trailer', 'High-Altitude Aerial Drone', 'Spatial Audio Recording'],
                packages: [
                    {
                        name: 'Cinematic Grand Legacy Package',
                        price: '220,000 ETB',
                        features: ['3 Cinema Operators + 1 Drone Pilot', 'Same-Day Edit (SDE) for Evening Screen', 'Full Feature Documentary (45-60 min)', '60-second Instagram Reel highlights', 'Master 4K USB Drive with Wooden Box']
                    }
                ],
                experienceYears: 7,
                completedEvents: 310
            },
            {
                name: 'Selam Studio & Fine Art Photography',
                slug: 'selam-fine-art-photo',
                category: 'Media',
                subcategories: ['Editorial Photography', 'Portraits', 'Traditional Melse Media'],
                tagline: 'Vogue-inspired editorial portraits and timeless wedding albums',
                bio: 'Led by award-winning visual artist Selamawit T., Selam Studio produces breathtaking editorial photography that turns every bridal gaze and celebration moment into timeless fine art. Featured in international fashion and wedding publications.',
                location: 'Addis Ababa (Bole Medhanialem)',
                address: 'Cameroon St, Bole, Addis Ababa',
                rating: 4.8,
                reviewsCount: 31,
                isVerified: true,
                badge: 'Editorial Specialist',
                contactPhone: '+251 93 111 2233',
                contactEmail: 'info@selamstudio.et',
                instagram: '@selam_fineart_photo',
                priceRange: '$$$',
                startingPrice: '85,000 ETB',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
                portfolioImages: [
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1200&q=80'
                ],
                specialties: ['Editorial Bridal Portraits', 'Golden Hour Couple Sessions', 'Fine Art Leather-Bound Albums', 'High-Speed Flash Scenography'],
                packages: [
                    {
                        name: 'Signature Fine Art Wedding Collection',
                        price: '160,000 ETB',
                        features: ['2 Lead Photographers all day', 'Pre-Wedding Editorial Sunset Shoot', '700+ Master Color-Corrected High-Res Images', 'Handcrafted Italian Leather Album (40 pages)']
                    }
                ],
                experienceYears: 5,
                completedEvents: 195
            },
            {
                name: 'Botanica Bloom Floral Artisans',
                slug: 'botanica-bloom-decor',
                category: 'Decor',
                subcategories: ['Floral Art', 'Table Escapes', 'Outdoor Garden Setups'],
                tagline: 'Artisanal organic florals, meadow runners & botanical chandeliers',
                bio: 'Botanica Bloom redefines event styling through lush, organic floral installations. Sourcing the freshest highland blooms directly from Debre Zeyit and Holleta farms, we bring romance, fragrance, and bespoke aesthetic wonder to every celebration.',
                location: 'Addis Ababa (Sarbet)',
                address: 'South Africa St, Sarbet, Addis Ababa',
                rating: 4.9,
                reviewsCount: 27,
                isVerified: true,
                badge: 'Floral Master',
                contactPhone: '+251 91 888 9900',
                contactEmail: 'bloom@botanicadecor.et',
                instagram: '@botanicabloom_et',
                priceRange: '$$$',
                startingPrice: '75,000 ETB',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                coverImage: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1600&q=80',
                portfolioImages: [
                    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80'
                ],
                specialties: ['Highland Meadow Runners', 'Living Floral Archways', 'Suspended Botanical Clouds', 'Custom Bridal Bouquets'],
                packages: [
                    {
                        name: 'Lush Botanical Dream',
                        price: '135,000 ETB',
                        features: ['Full Floral Ceremony Arch', '20 Guest Table Living Centerpieces', 'Bridal & Bridesmaid Bouquet Suite', 'Champagne Table Floral Cascade']
                    }
                ],
                experienceYears: 4,
                completedEvents: 110
            }
        ];

        const crypto = require('crypto');
        const defaultHash = (pwd) => {
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(pwd, salt, 1000, 64, 'sha512').toString('hex');
            return `${salt}:${hash}`;
        };

        const vendorsWithCreds = vendorsData.map(v => ({
            ...v,
            username: v.username || v.slug || v.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            password: v.password || defaultHash('vendor123')
        }));

        const insertedVendors = await Vendor.insertMany(vendorsWithCreds);
        console.log(`Seeded ${insertedVendors.length} Curated Vendors with credentials.`);

        const [aura, zema, liyu, selam, botanica] = insertedVendors;

        // 2. Seed Inspirations (Pinterest-Style Masonry Items)
        const inspirationsData = [
            {
                title: 'Ethereal Glasshouse Stage with Crystal Cascades',
                description: 'Floor-to-ceiling glass architecture framed by cascading white wisteria, imported orchid runners, and warm candlelight glow for a 500-guest ballroom reception.',
                imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
                category: 'Decor',
                subCategory: 'Modern Luxury',
                eventType: 'Modern Wedding',
                vendorId: aura._id,
                palette: ['#F9F6F0', '#C5A880', '#536878', '#2F3E46'],
                tags: ['Glasshouse', 'Crystal Chandelier', 'White Florals', 'Luxury Stage', 'Ballroom'],
                likesCount: 142,
                savesCount: 68,
                aspectRatio: '4/5',
                featured: true
            },
            {
                title: 'Royal Melse Golden Zufan Throne & Velvet Drapes',
                description: 'Authentic Ethiopian royal Melse ceremony stage featuring handcrafted gold-carved chairs, vibrant green and gold embroidered silk, and ceremonial Mesob accents.',
                imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
                category: 'Traditional',
                subCategory: 'Traditional Melse',
                eventType: 'Traditional Melse',
                vendorId: zema._id,
                palette: ['#D4AF37', '#2A6F97', '#780000', '#FDF0D5'],
                tags: ['Melse Decor', 'Zufan Stage', 'Habesha Traditional', 'Gold Tilet', 'Royal Silk'],
                likesCount: 215,
                savesCount: 94,
                aspectRatio: '1/1',
                featured: true
            },
            {
                title: 'Cinematic Sunset Couple Silhouette at Entoto Hills',
                description: 'Golden hour drone and 85mm anamorphic portraiture capturing the ethereal twilight skyline of Addis Ababa overlooking Entoto Natural Park.',
                imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
                category: 'Media',
                subCategory: 'Cinematic Film',
                eventType: 'Modern Wedding',
                vendorId: liyu._id,
                palette: ['#E07A5F', '#3D405B', '#81B29A', '#F4F1DE'],
                tags: ['Entoto Hills', 'Cinematic Portrait', 'Golden Hour', 'Drone Shot', 'Sunset Glow'],
                likesCount: 189,
                savesCount: 77,
                aspectRatio: '4/5',
                featured: true
            },
            {
                title: 'Monochromatic White Rose & Mirrored Runway',
                description: 'A 40-meter mirrored infinity runway bordered with over 4,000 white highland roses and geometric crystal chandeliers designed for grand ballroom entry.',
                imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
                category: 'Decor',
                subCategory: 'Modern Luxury',
                eventType: 'Modern Wedding',
                vendorId: aura._id,
                palette: ['#FFFFFF', '#E2E8F0', '#94A3B8', '#1E293B'],
                tags: ['Mirrored Runway', 'White Roses', 'Grand Entryway', 'Monochrome Decor', 'Grand Stage'],
                likesCount: 164,
                savesCount: 83,
                aspectRatio: '16/9',
                featured: false
            },
            {
                title: 'Editorial Habesha Kemis Bridal Heritage Portrait',
                description: 'Fine art studio lighting highlighting the intricate golden embroidery and woven silk of contemporary high-fashion Habesha bridal couture.',
                imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
                category: 'Media',
                subCategory: 'Editorial Photography',
                eventType: 'Traditional Melse',
                vendorId: selam._id,
                palette: ['#F3E9D2', '#C9A66B', '#114B5F', '#1A1A1A'],
                tags: ['Habesha Kemis', 'Editorial Portrait', 'Bridal Couture', 'Heritage Studio', 'Fine Art'],
                likesCount: 230,
                savesCount: 112,
                aspectRatio: '4/5',
                featured: true
            },
            {
                title: 'Botanical Hanging Cloud & Candlelit Tablescape',
                description: 'Suspended eucalyptus, baby breath, and baby peach garden roses hovering over long banquet tables adorned with tapered ivory wax candles.',
                imageUrl: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1000&q=80',
                category: 'Floral Art',
                subCategory: 'Floral Architecture',
                eventType: 'Private Celebration',
                vendorId: botanica._id,
                palette: ['#588157', '#A3B18A', '#DAD7CD', '#344E41'],
                tags: ['Floral Cloud', 'Candlelight', 'Banquet Table', 'Botanical Canopy', 'Organic Florals'],
                likesCount: 97,
                savesCount: 45,
                aspectRatio: '1/1',
                featured: false
            },
            {
                title: 'Corporate Innovation Gala Dynamic Lighting & LED Screen Scenography',
                description: 'Sleek corporate summit stage with curved 8K LED walls, architectural cobalt blue lighting arrays, and minimalist podium florals.',
                imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
                category: 'Lighting & Stage',
                subCategory: 'Stage Design',
                eventType: 'Corporate Gala',
                vendorId: aura._id,
                palette: ['#0A192F', '#0077B6', '#90E0EF', '#03045E'],
                tags: ['Corporate Gala', 'LED Stage', 'Blue Lighting', 'Conference Scenography', 'Keynote Stage'],
                likesCount: 88,
                savesCount: 39,
                aspectRatio: '16/9',
                featured: false
            },
            {
                title: 'Candlelit Nighttime Garden Ceremony Arch with Pampas Grass',
                description: 'Bohemian luxury outdoor archway with textured pampas grass plumes, blush dahlias, and dozens of floor hurricane lanterns creating a dreamlike glow.',
                imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80',
                category: 'Floral Art',
                subCategory: 'Floral Architecture',
                eventType: 'Modern Wedding',
                vendorId: botanica._id,
                palette: ['#E9D8A6', '#EE9B00', '#CA6702', '#9B2226'],
                tags: ['Pampas Grass', 'Garden Wedding', 'Hurricane Lanterns', 'Night Ceremony', 'Boho Luxe'],
                likesCount: 135,
                savesCount: 58,
                aspectRatio: '4/5',
                featured: false
            },
            {
                title: 'Same-Day Edit High-Energy Melse Dance Cinema Frame',
                description: 'Crisp freeze-frame from 4K 120fps video capturing the ecstatic energy of traditional Gursha & Eskista dance during the evening Melse.',
                imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
                category: 'Media',
                subCategory: 'Cinematic Film',
                eventType: 'Traditional Melse',
                vendorId: liyu._id,
                palette: ['#BC6C25', '#DDA15E', '#606C38', '#283618'],
                tags: ['Melse Dance', 'Eskista Energy', 'Same-Day Edit', 'Action Cinema', 'Habesha Joy'],
                likesCount: 176,
                savesCount: 63,
                aspectRatio: '16/9',
                featured: false
            }
        ];

        const insertedInspirations = await Inspiration.insertMany(inspirationsData);
        console.log(`Seeded ${insertedInspirations.length} Inspirations.`);

        // 3. Seed Sample User Boards
        const boardsData = [
            {
                title: 'My Dream Addis Ballroom Wedding 2026',
                description: 'Curated mood board for our grand 450-guest celebration at Skylight Hotel ballroom. Focus on glass stages, white roses, and cinematic film.',
                coverImage: insertedInspirations[0].imageUrl,
                eventType: 'Modern Wedding',
                inspirations: [
                    insertedInspirations[0]._id,
                    insertedInspirations[2]._id,
                    insertedInspirations[3]._id
                ]
            },
            {
                title: 'Royal Melse & Heritage Aesthetic',
                description: 'Traditional gold Zufan, authentic coffee ceremony setup, and editorial heritage portraits for our Sunday Melse.',
                coverImage: insertedInspirations[1].imageUrl,
                eventType: 'Traditional Melse',
                inspirations: [
                    insertedInspirations[1]._id,
                    insertedInspirations[4]._id,
                    insertedInspirations[8]._id
                ]
            }
        ];

        await Board.insertMany(boardsData);
        console.log('Seeded User Boards.');

        // 4. Seed Inquiries
        const inquiriesData = [
            {
                vendorId: aura._id,
                clientName: 'Bethelhem Tadesse',
                clientEmail: 'bethelhem.t@example.com',
                clientPhone: '+251 91 999 1122',
                eventType: 'Modern Wedding',
                eventDate: new Date('2026-11-20'),
                location: 'Addis Ababa (Ethiopian Skylight Hotel)',
                guestCount: '400-500 guests',
                budgetRange: '200,000 - 300,000 ETB',
                message: 'Hello AURA team, we loved your Glasshouse Stage and White Floral runway. We are planning our wedding reception at Skylight Grand Ballroom and would love to receive a detailed quote.',
                servicesNeeded: ['Grand Stage Decor', 'Ceiling Drapes', 'Floral Runway'],
                status: 'New'
            },
            {
                vendorId: liyu._id,
                clientName: 'Dawit Mengistu',
                clientEmail: 'dawit.m@example.com',
                clientPhone: '+251 92 888 3344',
                eventType: 'Modern Wedding',
                eventDate: new Date('2026-12-05'),
                location: 'Sheraton Addis',
                guestCount: '350 guests',
                budgetRange: '180,000 - 250,000 ETB',
                message: 'Looking for 3-camera coverage and same-day edit trailer for our reception at Sheraton Addis.',
                servicesNeeded: ['Cinematic Film', 'Drone Coverage', 'Same-Day Edit'],
                status: 'In Review'
            }
        ];

        await Inquiry.insertMany(inquiriesData);
        console.log('Seeded Inquiries.');

        // 5. Seed Reviews
        const reviewsData = [
            {
                vendorId: aura._id,
                authorName: 'Hanna & Yared',
                authorRole: 'Bride & Groom',
                rating: 5,
                eventType: 'Modern Wedding',
                comment: 'AURA exceeded our wildest imaginations! The stage looked straight out of Architectural Digest. Every single guest was blown away by the crystal chandeliers.',
                date: 'January 2026'
            },
            {
                vendorId: zema._id,
                authorName: 'Makeda Haile',
                authorRole: 'Host / Sister of Bride',
                rating: 5,
                eventType: 'Traditional Melse',
                comment: 'Zema created the most majestic Melse setup in Kazanchis! The Zufan chairs and the coffee ceremony corner were simply perfection.',
                date: 'February 2026'
            },
            {
                vendorId: liyu._id,
                authorName: 'Samuel & Tsion',
                authorRole: 'Couple',
                rating: 5,
                eventType: 'Wedding & Melse',
                comment: 'The same-day edit video brought everyone to tears at the reception. Liyu Cinema is worth every single penny.',
                date: 'March 2026'
            }
        ];

        await Review.insertMany(reviewsData);
        console.log('Seeded Reviews.');

        console.log('✅ Database seeded successfully with curated Ethiopian event inspiration & verified vendor profiles!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seedData();
