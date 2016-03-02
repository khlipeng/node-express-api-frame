var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('config');

var schema = module.exports = new mongoose.Schema({
  email: {type: String, unique: true, required: true }, // 大小写不敏感
  name: {type: String, unique: true, required: true }, // 
  role: { type: String, enum: ['teacher', 'student', 'admin'], default: 'student'},
  // clients : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },  //Clients
  // icon: String,
  password: String,
  // emailVerified: {type: Boolean , default: true },
  updatedTime: {type: Date},
  createdTime: {type: Date, default: Date.now},
  isDeleted:{ type: Boolean, default:false }
},{ 
  versionKey: '_version' 
});

schema.pre('save', function(next) {
  var self = this;
  if(self.isNew){
    self.email = self.email.toLowerCase();
  }
  if (!self.isModified('password')) {
    return next();
  }

  bcrypt.hash(self.password, config.bcrypt.rounds, function(err, hash) {
    if (err) {
      return next(err);
    }
    self.password = hash;
    next();
  });
});

schema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

if (!schema.options.toJSON) {
  schema.options.toJSON = {};
}
schema.options.toJSON.transform = function (doc, ret) {
  delete ret.password;
  delete ret.__v;
  delete ret._id;
  delete ret.isDeleted;
  delete ret._version;
  ret.createdTime = ret.createdTime && ret.createdTime.valueOf();
  ret.id = ret._id;
};
