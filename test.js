const mongoose = require('mongoose');

// 直接把字串貼進來測
const testUri = "mongodb://root:gundam7788@ubuntu.orb.local:27017/admin?authSource=admin&directConnection=true";

mongoose.connect(testUri)
  .then(() => console.log('✅ 程式連線成功！'))
  .catch(err => console.error('❌ 程式連線還是失敗:', err.message));