namespace :db do
  desc 'Restores Users etc'
  task restore_planning: :environment do |task|
    with_config do |app, host, database, user, pass|
    cmd = "PGPASSWORD='#{pass}' pg_restore -a -h '#{host}' -U '#{user}' -d '#{database}' -vxOW -j 8 -n public -T census2020tracts #{Rails.root}/lib/import/calbuilds_dev.dump"
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
