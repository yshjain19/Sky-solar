require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Project = require('../models/Project');
const Admin = require('../models/Admin');

async function runMongooseTests() {
  console.log('--- RUNNING MONGOOSE & MODEL TESTS ---');
  let passed = 0;
  let failed = 0;

  const testAssert = (cond, msg) => {
    if (cond) {
      console.log(`✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${msg}`);
      failed++;
    }
  };

  // Connect to Database
  const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sky-solar';
  try {
    await mongoose.connect(dbUri);
    console.log(`✓ DB connected for tests: ${dbUri}`);
    passed++;
  } catch (err) {
    console.error('✗ DB Connection failed:', err);
    failed++;
    process.exit(1);
  }

  // Test 1: Validate Admin Registration / Check Seeding
  try {
    const adminCount = await Admin.countDocuments();
    testAssert(adminCount >= 0, 'Admin collection should be queryable');
  } catch (err) {
    console.error('Test 1 error:', err);
    failed++;
  }

  // Test 2: Validate Mongoose Lead Validations
  try {
    const badLead = new Lead({
      fullName: 'A', // Too short
      mobileNumber: '1234567890', // Starts with 1, invalid
      email: 'bademail.com',
      city: '', // Required
      pinCode: '12345', // Must be 6 digits
      propertyType: 'invalid_type', // Must match enum
      monthlyBill: -50 // Cannot be negative
    });

    try {
      await badLead.validate();
      testAssert(false, 'Invalid lead should fail Mongoose validation');
    } catch (err) {
      testAssert(err.name === 'ValidationError', 'Mongoose should throw ValidationError on bad inputs');
      testAssert(err.errors.fullName !== undefined, 'Validation should catch short fullName');
      testAssert(err.errors.mobileNumber !== undefined, 'Validation should catch invalid Indian mobile pattern');
      testAssert(err.errors.email !== undefined, 'Validation should catch malformed email');
      testAssert(err.errors.pinCode !== undefined, 'Validation should catch invalid PIN Code length');
      testAssert(err.errors.propertyType !== undefined, 'Validation should catch bad propertyType enum');
      testAssert(err.errors.monthlyBill !== undefined, 'Validation should catch negative monthlyBill');
    }

    const goodLead = new Lead({
      fullName: 'Siddharth Patel',
      mobileNumber: '9876543210',
      email: 'sid.patel@gmail.com',
      city: 'Indore',
      pinCode: '452001',
      propertyType: 'commercial',
      monthlyBill: 5500
    });
    
    await goodLead.validate();
    testAssert(true, 'Correct lead parameters should pass Mongoose validation');

  } catch (err) {
    console.error('Test 2 error:', err);
    failed++;
  }

  // Test 3: Project CRUD operations
  try {
    const initialCount = await Project.countDocuments();
    
    const testProject = await Project.create({
      title: 'Mongoose Test Villa',
      location: 'Indore, Madhya Pradesh',
      capacity: '6.5 kW',
      category: 'residential',
      type: 'Hybrid Solar',
      image: './public/images/residential_solar.png'
    });

    const newCount = await Project.countDocuments();
    testAssert(newCount === initialCount + 1, 'Project count should increase by 1 after insertion');

    await Project.findByIdAndDelete(testProject._id);
    const finalCount = await Project.countDocuments();
    testAssert(finalCount === initialCount, 'Project count should revert to original after deletion');
  } catch (err) {
    console.error('Test 3 error:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(` MONGOOSE TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);

  await mongoose.disconnect();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runMongooseTests();
