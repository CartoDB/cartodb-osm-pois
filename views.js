var yaml = require('js-yaml');
var fs   = require('fs');
var util = require('util');

function query(view) {
  return util.format("CREATE MATERIALIZED VIEW %s AS\n\
SELECT \n\
    id,\n\
    st_transform(planet.the_geom, 4326)::geometry(Geometry,4326) AS the_geom,\n\
    the_geom AS the_geom_webmercator,\n\
    %s\n\
  FROM planet\n\
  WHERE %s;", view.name, view.select, view.where);
}

function uniqueindex(view) {
  return util.format("CREATE UNIQUE INDEX IF NOT EXISTS %s_id_idx ON %s (id);", view.name, view.name);
}

var doc = yaml.safeLoad(fs.readFileSync('views.yml', 'utf8'));

doc.forEach(function(view) {
  console.log(query(view));
  console.log(uniqueindex(view));
  console.log(util.format("GRANT SELECT ON %s TO PUBLIC;\n", view.name));
});