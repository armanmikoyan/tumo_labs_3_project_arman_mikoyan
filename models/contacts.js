const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const contacrsSchema = new Schema({
	name:{
		type: String,
		required:  true,
	},
	
	link:{
		type: String,
		required:  true,
	}
})

const Contact = mongoose.model('contacts',contacrsSchema)


module.exports = Contact