const mongoose = require('mongoose')
mongoose.set ('strictQuery',false)

const url = process.env.MONGODB_URI

if(!url) {
	console.log('Error:MONGODB_URI not found in .env file')
	process.exit(1)
}

console.log('正在連接',url)

mongoose.connect(url,{dbName:'phonebook'})
	.then(result => {
		console.log('連接資料庫成功')
	})
	.catch((error)=>{
		console.log('連接資料庫錯誤:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
		//unique: true  // 添加唯一約束
	},
	number: {
  	type: String,
  	required: true,
  	minlength: [8, 'number must be at least 8 characters long'],
  	match: [/^\d+-\d+$/, 'number must be digits, contain exactly one dash, and dash cannot be at start or end']
	}

})

personSchema.set('toJSON',{
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)
