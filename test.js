const mongoose = require('mongoose')

// 將原本的 oocw0wg... 換成你的伺服器 IP 192.168.139.205
const url = "mongodb://root:gundam00@192.168.139.205:27017/?authSource=admin&directConnection=true"

mongoose.connect(url)
  .then(() => {
    console.log('✅ 驗證成功！連線正常。')
    mongoose.connection.close()
  })
  .catch(err => {
    console.error('❌ 驗證失敗：', err.message)
  })