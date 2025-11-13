// Migration script to update existing orders and users with new location fields
// Run this script once to migrate existing data to the new location structure

const { MongoClient } = require('mongodb');

// MongoDB connection URL - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://clarcgumapon24_db_user:wogMb7l81NvEWf3i@ecom.zvj7z1z.mongodb.net/ecom?retryWrites=true&w=majority&appName=ecom';

async function migrateLocationData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Migrate Orders collection
    console.log('Migrating Orders collection...');
    const ordersResult = await db.collection('orders').updateMany(
      {
        // Find orders that don't have the new fields
        $or: [
          { 'shippingAddress.barangay': { $exists: false } },
          { 'shippingAddress.municipality': { $exists: false } }
        ]
      },
      {
        $set: {
          'shippingAddress.barangay': '', // Set empty string as default
          'shippingAddress.municipality': '' // Set empty string as default
        }
      }
    );
    console.log(`Updated ${ordersResult.modifiedCount} orders`);
    
    // Migrate Users collection
    console.log('Migrating Users collection...');
    const usersResult = await db.collection('users').updateMany(
      {
        // Find users that have address but don't have the new fields
        'address': { $exists: true },
        $or: [
          { 'address.barangay': { $exists: false } },
          { 'address.municipality': { $exists: false } },
          { 'address.region': { $exists: false } }
        ]
      },
      [
        {
          $set: {
            'address.barangay': '',
            'address.municipality': '',
            'address.region': { $ifNull: ['$address.state', ''] }, // Migrate state to region
            'address.state': '$$REMOVE' // Remove old state field
          }
        }
      ]
    );
    console.log(`Updated ${usersResult.modifiedCount} users`);
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    await db.collection('orders').createIndex({ 'shippingAddress.region': 1 });
    await db.collection('orders').createIndex({ 'shippingAddress.city': 1 });
    await db.collection('users').createIndex({ 'address.region': 1 });
    await db.collection('users').createIndex({ 'address.city': 1 });
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
if (require.main === module) {
  migrateLocationData().catch(console.error);
}

module.exports = { migrateLocationData };
