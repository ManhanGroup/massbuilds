# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#
# scp calbuilds@prep.mapc.org:/home/calbuilds/calbuilds.dump tmp/calbuilds.dump
 #pg_restore -a -d calbuilds_development -vxOW -t users  lib/import/calbuilds_dev.dump
 
 #pg_restore -a -d calbuilds_development -vxOW -t developments -t edits -t flags lib/import/calbuilds_dev.dump
 
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t parcels lib/import/parcels.dump
 
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t tazs  lib/import/tazs.dump
  
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t tod_service_area_poly lib/import/tod_service_area_poly.dump
   
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t rpa_poly  lib/import/rpa_poly.dump
    
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t neighborhoods_poly  lib/import/neighborhoods_poly.dump
     
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t counties_polym lib/import/counties_polym.dump
 
 #pg_restore -a -d calbuilds_development -vxOW -j 8 -t ca_place lib/import/ca_place.dump

puts 'import:user_data'
Rake::Task["import:user_data"].invoke

puts 'import:development_data'
Rake::Task["import:development_data"].invoke

puts 'restore planning tables' 
Rake::Task["db:restore_planning"].invoke




    

 


