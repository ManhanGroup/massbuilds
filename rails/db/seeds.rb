# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#
# scp calbuilds@prep.mapc.org:/home/calbuilds/calbuilds.dump tmp/calbuilds.dump
# pg_restore -a -d calbuilds_development -O -t users -t developments -t parcels -t edits tmp/calbuilds.dump

Rake::Task["db:add_foreign_data_wrapper_interface"].invoke
Rake::Task["db:add_rpa_fdw"].invoke
Rake::Task["db:add_counties_fdw"].invoke
Rake::Task["db:add_municipalities_fdw"].invoke
Rake::Task["db:add_tod_service_area_poly"].invoke
Rake::Task["db:add_neighborhoods_poly"].invoke
