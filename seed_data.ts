// seed_data.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import navbarCategoriesData, { 
  DataHelpers, 
  experiencesData, 
  popularOmoValleyTours 
} from './app/data/travel_data.js';
import User from './app/models/User.js';
import Tour from './app/models/Tour.js';
import Destination from './app/models/Destination.js';
import Festival from './app/models/Festival.js';
import Experience from './app/models/Experience.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://surafelriseon_db_user:8PnBQozmN5ZPGqqw@ac-uatmqtz-shard-00-00.lrvpk1h.mongodb.net:27017,ac-uatmqtz-shard-00-01.lrvpk1h.mongodb.net:27017,ac-uatmqtz-shard-00-02.lrvpk1h.mongodb.net:27017/?ssl=true&replicaSet=atlas-xi9b86-shard-0&authSource=admin&appName=Mystery";

// Helper function to extract days from duration string
const extractDays = (duration: string): number => {
  const match = duration.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

// Helper function to ensure experience has required fields
const ensureExperienceFields = (exp: any) => {
  return {
    ...exp,
    location: exp.location || exp.coordinates?.city || 'Ethiopia',
    shortDescription: exp.shortDescription || exp.description?.substring(0, 150) || 'Experience Ethiopia',
    included: exp.included || [],
    notIncluded: exp.notIncluded || [],
    languages: exp.languages || ['English'],
    groupSize: exp.groupSize || '2-8 people',
    ageRange: exp.ageRange || 'All ages',
    whatToBring: exp.whatToBring || [],
    meetingPoint: exp.meetingPoint || 'To be confirmed',
    startTimes: exp.startTimes || ['Flexible'],
    culturalSignificance: exp.culturalSignificance || 'Experience Ethiopian culture',
    seasonalAvailability: exp.seasonalAvailability || 'Year-round',
    status: exp.status || 'active',
    price: exp.price || 0 // Price from data source, default to 0 if not set
  };
};

// Helper function to log category summary
const logCategorySummary = (allTours: any[], allDestinations: any[], allFestivals: any[], allExperiences: any[]) => {
  console.log('\n' + '='.repeat(50));
  console.log('📊 CATEGORY-SPECIFIC DATA SUMMARY');
  console.log('='.repeat(50));

  // Historical Tours
  const historicalTours = allTours.filter((tour: any) => 
    tour.id?.startsWith('hist-') || 
    (tour.tag && tour.tag.toLowerCase().includes('historical'))
  );
  console.log(`\n📜 Historical Tours: ${historicalTours.length} found`);
  if (historicalTours.length > 0) {
    historicalTours.slice(0, 5).forEach((tour: any) => 
      console.log(`   - ${tour.name} (${tour.duration}) [Price: $${tour.price || 0}]`)
    );
    if (historicalTours.length > 5) console.log(`   ... and ${historicalTours.length - 5} more`);
  }

  // Cultural Tours
  const culturalTours = allTours.filter((tour: any) => 
    tour.id?.startsWith('cult-') || 
    (tour.tag && tour.tag.toLowerCase().includes('cultural'))
  );
  console.log(`\n🎭 Cultural Tours: ${culturalTours.length} found`);
  if (culturalTours.length > 0) {
    culturalTours.slice(0, 5).forEach((tour: any) => 
      console.log(`   - ${tour.name} (${tour.duration}) [Price: $${tour.price || 0}]`)
    );
    if (culturalTours.length > 5) console.log(`   ... and ${culturalTours.length - 5} more`);
  }

  // Nature/Adventure Tours
  const natureKeywords = ['nature', 'adventure', 'trekking', 'mountains', 'wildlife', 'hiking', 'expedition', 'park'];
  const natureTours = allTours.filter((tour: any) => 
    tour.id?.startsWith('nat-') || 
    (tour.tag && natureKeywords.some(keyword => tour.tag!.toLowerCase().includes(keyword)))
  );
  console.log(`\n🏔️ Nature/Adventure Tours: ${natureTours.length} found`);
  if (natureTours.length > 0) {
    natureTours.slice(0, 5).forEach((tour: any) => 
      console.log(`   - ${tour.name} (${tour.duration}) [Price: $${tour.price || 0}]`)
    );
    if (natureTours.length > 5) console.log(`   ... and ${natureTours.length - 5} more`);
  }

  // Tours by Tag Values
  console.log('\n🏷️ Tours by Tag Values:');
  const tagValues = [...new Set(allTours
    .filter((tour: any) => tour.tag)
    .map((tour: any) => tour.tag as string)
  )];
  tagValues.forEach((tag: string) => {
    const toursByTag = allTours.filter((tour: any) => tour.tag === tag);
    console.log(`   ${tag}: ${toursByTag.length} tours`);
    toursByTag.slice(0, 2).forEach((tour: any) => console.log(`      - ${tour.name} ($${tour.price || 0})`));
    if (toursByTag.length > 2) console.log(`      ... and ${toursByTag.length - 2} more`);
  });

  // Tours by Duration
  console.log('\n⏱️ Tours by Duration:');
  
  const shortTours = allTours.filter((tour: any) => {
    const days = extractDays(tour.duration);
    return days >= 1 && days <= 3;
  });
  console.log(`   Short (1-3 days): ${shortTours.length} tours`);

  const mediumTours = allTours.filter((tour: any) => {
    const days = extractDays(tour.duration);
    return days >= 4 && days <= 7;
  });
  console.log(`   Medium (4-7 days): ${mediumTours.length} tours`);

  const longTours = allTours.filter((tour: any) => {
    const days = extractDays(tour.duration);
    return days >= 8;
  });
  console.log(`   Long (8+ days): ${longTours.length} tours`);

  // Tours by Difficulty
  console.log('\n📊 Tours by Difficulty:');
  const difficulties = [...new Set(allTours.map((tour: any) => tour.difficulty))];
  difficulties.forEach((difficulty: string) => {
    const toursByDifficulty = allTours.filter((tour: any) => tour.difficulty === difficulty);
    console.log(`   ${difficulty}: ${toursByDifficulty.length} tours`);
  });

  // Top Rated Tours
  console.log('\n⭐ Top Rated Tours (4.8+):');
  const topRatedTours = allTours.filter((tour: any) => tour.rating >= 4.8);
  if (topRatedTours.length > 0) {
    topRatedTours.slice(0, 5).forEach((tour: any) => 
      console.log(`   - ${tour.name}: ${tour.rating} (${tour.reviewCount} reviews) [Price: $${tour.price || 0}]`)
    );
    if (topRatedTours.length > 5) console.log(`   ... and ${topRatedTours.length - 5} more`);
  }

  // Featured Tours
  const featuredTours = allTours.filter((tour: any) => tour.featured);
  console.log(`\n🌟 Featured Tours: ${featuredTours.length} found`);

  // Destinations by Type
  console.log('\n🏞️ Destinations by Type:');
  const destinationTypes = [...new Set(allDestinations.map((dest: any) => dest.type))];
  destinationTypes.forEach((type: string) => {
    const destsByType = allDestinations.filter((dest: any) => dest.type === type);
    console.log(`   ${type}: ${destsByType.length} destinations`);
  });

  // Featured Destinations
  const featuredDestinations = allDestinations.filter((dest: any) => dest.featured);
  console.log(`\n🌟 Featured Destinations: ${featuredDestinations.length} found`);

  // Festivals
  console.log(`\n🎉 Festivals: ${allFestivals.length} found`);
  
  // Experiences by Category
  console.log('\n✨ Experiences by Category:');
  const experienceCategories = [...new Set(allExperiences.map((exp: any) => exp.category))];
  experienceCategories.forEach((category: string) => {
    const expsByCategory = allExperiences.filter((exp: any) => exp.category === category);
    console.log(`   ${category}: ${expsByCategory.length} experiences`);
  });

  // Featured Experiences
  const featuredExpCount = allExperiences.filter((exp: any) => exp.featured);
  console.log(`\n🌟 Featured Experiences: ${featuredExpCount.length} found`);
  
  console.log('\n' + '='.repeat(50));
};

// Helper function to safely remove duplicates before seeding
const removeDuplicates = (data: any[], key: string): any[] => {
  const seen = new Set();
  return data.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      console.warn(`⚠️ Duplicate ${key} found: ${value} - skipping`);
      return false;
    }
    seen.add(value);
    return true;
  });
};

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Verify connection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Drop existing collections
    console.log('\n🗑️ Dropping existing collections...');
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`   Dropped collection: ${collection.name}`);
    }
    console.log('✅ Existing data cleared');

    // Get data from DataHelpers
    console.log('\n📦 Fetching data from DataHelpers...');
    let allTours = DataHelpers.getAllTours();
    let allDestinations = DataHelpers.getAllDestinations();
    const allFestivals = DataHelpers.getAllFestivals();

    // Remove duplicate destinations by slug
    allDestinations = removeDuplicates(allDestinations, 'slug');

    // Get featured experiences from navbarCategoriesData
    const featuredExperiences = navbarCategoriesData.featured?.experiences || [];
    console.log(`   Found ${featuredExperiences.length} featured experiences`);

    // Combine all experiences
    const allExperiences = [...experiencesData, ...popularOmoValleyTours, ...featuredExperiences];
    const uniqueExperiences = removeDuplicates(allExperiences, 'slug');

    // Ensure all experiences have required fields
    const validatedExperiences = uniqueExperiences.map(ensureExperienceFields);

    console.log(`   Found ${allTours.length} tours (after removing duplicates)`);
    console.log(`   Found ${allDestinations.length} destinations (after removing duplicates)`);
    console.log(`   Found ${allFestivals.length} festivals`);
    console.log(`   Found ${validatedExperiences.length} experiences (after validation)`);

    // Log category summary
    logCategorySummary(allTours, allDestinations, allFestivals, validatedExperiences);

    // Create admin user
    console.log('\n👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@omodelta.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`   ✅ Admin user created: ${adminUser.email}`);

    // Create owner user
    

    // Create sample client users
    console.log('👥 Creating client users...');
    const clientPassword = await bcrypt.hash('client123', 10);
    const clientUsers = await User.create([
      {
        id: 'client-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: clientPassword,
        role: 'client',
        isVerified: true,
        phone: '+251 91 391 5507',
        location: 'Jinka, Ethiopia',
        bookingsCount: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'client-002',
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        password: clientPassword,
        role: 'client',
        isVerified: true,
        phone: '+251 91 391 5507',
        location: 'Jinka, Ethiopia',
        bookingsCount: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log(`   ✅ ${clientUsers.length} client users created`);

    // Seed tours with error handling
    console.log('\n🏔️ Seeding tours...');
    try {
      const toursToInsert = allTours.map((tour: any) => ({
        ...tour,
        price:tour.price, // Use price from data, default to 0 if not set
        status: tour.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Tour.insertMany(toursToInsert);
      console.log(`   ✅ ${allTours.length} tours seeded`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.error('   ❌ Duplicate key error. Check for duplicate slugs in your data.');
        console.error('   Error details:', error.message);
        const duplicateKey = error.keyPattern || error.keyValue;
        console.error('   Duplicate key:', duplicateKey);
      } else {
        throw error;
      }
    }

    // Seed destinations with error handling and skip duplicates
    console.log('📍 Seeding destinations...');
    try {
      const destinationsToInsert = allDestinations.map((dest: any) => ({
        ...dest,
        imageCount: dest.images?.length || 0,
        status: dest.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Destination.insertMany(destinationsToInsert, { ordered: false });
      console.log(`   ✅ ${allDestinations.length} destinations seeded`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.warn('   ⚠️ Some duplicate destinations were skipped');
        const count = await Destination.countDocuments();
        console.log(`   ✅ ${count} destinations seeded (duplicates skipped)`);
      } else {
        throw error;
      }
    }

    // Seed festivals
    console.log('🎉 Seeding festivals...');
    try {
      const festivalsToInsert = allFestivals.map((festival: any) => ({
        ...festival,
        status: festival.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Festival.insertMany(festivalsToInsert);
      console.log(`   ✅ ${allFestivals.length} festivals seeded`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.error('   ❌ Duplicate key error for festivals.');
        console.error('   Error details:', error.message);
      } else {
        throw error;
      }
    }

    // Seed experiences with validation
    console.log('✨ Seeding experiences...');
    try {
      const experiencesToInsert = validatedExperiences.map((exp: any) => ({
        ...exp,
        price: exp.price || 0, // Use price from data, default to 0 if not set
        status: exp.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Experience.insertMany(experiencesToInsert);
      console.log(`   ✅ ${validatedExperiences.length} experiences seeded`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.error('   ❌ Duplicate key error for experiences.');
        console.error('   Error details:', error.message);
      } else {
        throw error;
      }
    }

    // Create indexes for better performance
    console.log('\n🔧 Creating indexes...');
    
    const models = [Tour, Destination, Festival, Experience, User];
    
    for (const model of models) {
      try {
        await model.createIndexes();
        console.log(`   ✅ Indexes created for ${model.modelName}`);
      } catch (error) {
        console.log(`   ⚠️ Error with indexes for ${model.modelName}:`, error);
      }
    }

    // Log final summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(50));
    
    console.log('\n📈 FINAL SEEDING SUMMARY:');
    console.log('━'.repeat(40));
    console.log(`Users:          ${await User.countDocuments()}`);
    console.log(`Tours:          ${await Tour.countDocuments()}`);
    console.log(`Destinations:   ${await Destination.countDocuments()}`);
    console.log(`Festivals:      ${await Festival.countDocuments()}`);
    console.log(`Experiences:    ${await Experience.countDocuments()}`);
    console.log('━'.repeat(40));
    
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    console.log('✅ Database seeding completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Add error handling for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the seed function
seedDatabase();