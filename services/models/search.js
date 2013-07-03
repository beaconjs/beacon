var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");


exports.lookup = function(projectId, keyword, onSuccess, onError) {
  db.query("select 'note' as `type`, id, title, details from notes where title like '%" + keyword + "%' or details like '%" + keyword + "%' and project_id = " + projectId + "\
  union select 'epic' as `type`, id, title, details from epics where title like '%" + keyword + "%' or details like '%" + keyword + "%' and project_id = " + projectId + " \
  union select 'story' as `type`, s.id, s.title, s.details from stories s, epics e where s.epic_id=e.id and s.title like '%" + keyword + "%' or s.details like '%" + keyword + "%' and e.project_id = " + projectId + " \
  union select 'bug' as `type`, id, title, details from bugs where title like '%" + keyword + "%' or details like '%" + keyword + "%' and project_id = " + projectId + " \
  union select 'todo' as `type`, id, title, details from todos where title like '%" + keyword + "%' or details like '%" + keyword + "%' and project_id = " + projectId
  ).success(onSuccess).error(onError);
}
