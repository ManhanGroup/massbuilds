namespace :db do
  desc 'Restores Planning Tables'
  task restore_planning: :environment do |task|
    with_config do |app, host, database, user, pass|
    cmd = "PGPASSWORD='#{pass}' pg_restore -a -h '#{host}' -U '#{user}' -d '#{database}' -vxOW -j 8 -t ca_place -t counties_polym -t neighborhoods_poly -t rpa_poly -t tazs -t  tod_service_area_poly #{Rails.root}/lib/import/calbuilds_dev.dump"
    puts cmd
    exec cmd
    end
  end
  
  
  
  private
  def with_config
    yield Rails.application.class.module_parent_name.underscore,
      ActiveRecord::Base.connection_db_config.configuration_hash[:host],
      ActiveRecord::Base.connection_db_config.configuration_hash[:database],
      ActiveRecord::Base.connection_db_config.configuration_hash[:username],
      ActiveRecord::Base.connection_db_config.configuration_hash[:password]  
  end

end
