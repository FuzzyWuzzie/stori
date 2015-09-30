module.exports = function(models) {
	return {
		postProjects: function(req, res, next) {
		  models.Project.create({
		    name: req.body.name,
		    description: req.body.description
		  }).then(function(project) {
		    res.json({
		      message: 'Project added!',
		      data: project
		    });
		  }).catch(function(err) {
		    next(err);
		  });
		},
		
		getProjects: function(req, res, next) {
		  models.Project.findAll().then(function(projects) {
		    res.json(projects);
		  }).catch(function(err) {
		    next(err);
		  });
		},
		
		getProject: function(req, res, next) {
		  models.Project.findById(req.params.project_id).then(function(project) {
		    res.json(project);
		  }).catch(function(err) {
		    next(err);
		  })
		},
		
		putProject: function(req, res, next) {
		  models.Project.findById(req.params.project_id).then(function(project) {
		    if(project) {
		      models.Project.update({
		        name: req.body.name ? req.body.name : project.name,
		        description: req.body.description ? req.body.description : project.description
		      }, {
		        where: {
		          id: req.params.project_id
		        }
		      }).then(function(rows) {
		        if(rows[0] == 1) {
		          models.Project.findById(req.params.project_id).then(function(project) {
		            res.json(project);
		          }).catch(function(err) {
		            next(err);
		          });
		        }
		        else {
		          next(null);
		        }
		      }).catch(function(err) {
		        next(err);
		      })
		    }
		    else {
		      next(null);
		    }
		  }).catch(function(err) {
		    next(err);
		  });
		},
		
		deleteProject: function(req, res, next) {
		  models.Project.findById(req.params.project_id).then(function(project) {
		    if(project) {
		      models.Project.destroy({
		        where: {
		          id: req.params.project_id
		        }
		      }).then(function(rows) {
		        if(rows == 1) {
		          res.json({ message: "Project deleted!" });
		        }
		        else {
		          next({ message: "Removed 0 rows!" });
		        }
		      }).catch(function(err) {
		        next(null);
		      })
		    }
		    else {
		      next(null);
		    }
		  }).catch(function(err) {
		    next(err);
		  });
		}
	};
}