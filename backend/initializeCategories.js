const Category = require('./models/category');

const categories = [
  { name: "JavaScript" },
  { name: "Python" },
  { name: "Ruby" },
  { name: "Java" }
];

const initializeCategories = async () => {
  try {
    // カテゴリが存在しない場合のみデータを挿入
    const existingCategories = await Category.find();
    console.log(existingCategories)
    if (existingCategories.length === 0) {
      await Category.insertMany(categories);
      console.log('Categories initialized.');
    } else {
      console.log('Categories already exist.');
    }
  } catch (error) {
    console.error('Error initializing categories:', error.message);
  }
};

module.exports = initializeCategories;
