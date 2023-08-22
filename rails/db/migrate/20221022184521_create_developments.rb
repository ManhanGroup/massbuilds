class CreateDevelopments < ActiveRecord::Migration[7.0]
  def up
    create_table :developments do |t|
      t.integer :user_id
      t.boolean :rdv
      t.boolean :asofright
      t.boolean :ovr55
      t.boolean :clusteros
      t.boolean :phased
      t.boolean :stalled
      t.string :name
      t.string :status
      t.text :descr
      t.string :prj_url
      t.string :address
      t.string :state, default: 'CA'
      t.string :zip_code
      t.integer :year_compl
      t.integer :prjarea
      t.integer :singfamhu
      t.integer :multifam
      t.integer :hu
      t.integer :gqpop
      t.integer :rptdemp
      t.integer :commsf
      t.integer :hotelrms
      t.bigint :total_cost
      t.float :ret_sqft
      t.float :ofcmd_sqft
      t.float :indmf_sqft
      t.float :whs_sqft
      t.float :rnd_sqft
      t.float :ei_sqft
      t.float :other_sqft
      t.float :hotel_sqft
      t.float :other_rate
      t.float :affordable
      t.decimal :latitude
      t.decimal :longitude
      t.string :parcel_id
      t.boolean :mixed_use
      t.geometry :point, limit: {:srid=>4326, :type=>"point"}
      t.string :programs
      t.boolean :forty_b
      t.boolean :residential
      t.boolean :commercial
      t.string :municipal
      t.string :devlper
      t.boolean :yrcomp_est
      t.integer :percomp_24
      t.integer :percomp_28
      t.integer :percomp_35
      t.integer :percomp_45
      t.integer :units_1bd
      t.integer :units_2bd
      t.integer :units_3bd
      t.integer :unknownhu  
      t.integer :affrd_unit
      t.integer :aff_u50
      t.integer :aff_50_80
      t.integer :aff_80_120
      t.integer :aff_120p
      t.integer :aff_unknown
      t.boolean :headqtrs
      t.string :park_type
      t.integer :publicsqft 
      t.integer :unk_sqft
      t.bigint :loc_id
      t.integer :parcel_fy
      t.string :rpa_name
      t.string :county
      t.string :nhood
      t.text :n_transit, array: true, default: []
      t.boolean :flag, null: false, default: false
      t.datetime :deleted_at      
      t.string :traffic_count_data
      t.boolean :proj_id_present
      t.boolean :traffic_count_data_present
      t.integer :taz
      t.string :apn
      t.boolean :trunc, default: false
      t.string :gluc
      t.string :placetype
      t.integer :proj_id
      t.string :stat_comts
      t.string :mix_descr
      t.string :notes        
      t.timestamps
    end 
    add_index :developments, :deleted_at
     
    
  end
end
