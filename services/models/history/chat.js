var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Chat = function(text, channel, author) {
 this.text = text, 
 this.channel = channel, 
 this.author = author
 this.created_at = new Date();
};

var chats_table = db.define('chats', {
      text: DataTypes.STRING,
      channel: DataTypes.STRING,
      author: DataTypes.STRING,
      created_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Chat;
exports.table=chats_table;

Chat.prototype.save=function(onSuccess, onError) {
    chats_table.build(this).save().success(onSuccess).error(onError);
};

Chat.all=function(channel, offset, limit, onSuccess, onError) {
    chats_table.findAll({ where: { channel: channel }, order: "created_at DESC", offset: offset, limit: limit }).success(onSuccess).error(onError);
};
