# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_13_194018) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "ambag_2015_taz", id: false, force: :cascade do |t|
    t.bigint "id"
    t.float "area"
    t.bigint "taz_number"
    t.bigint "universalt"
    t.float "pumaregion"
    t.float "tract_id"
    t.text "blockgroup"
    t.text "county"
    t.text "jurisdicti"
    t.float "jurisdict1"
    t.bigint "population"
    t.bigint "groupquart"
    t.bigint "households"
    t.float "agricultur"
    t.float "constructi"
    t.float "industrial"
    t.float "retail_emp"
    t.float "service_em"
    t.float "public_emp"
    t.float "total_empl"
    t.float "agr"
    t.float "mfg"
    t.float "tr_con"
    t.float "whl"
    t.float "ret"
    t.float "fire"
    t.float "edu"
    t.float "hlt"
    t.float "srv"
    t.float "pub"
    t.float "self"
    t.float "total_emp1"
    t.bigint "k12_enroll"
    t.bigint "university"
    t.bigint "visitors"
    t.bigint "hotel_room"
    t.text "external_s"
    t.text "region"
    t.float "urban_zone"
    t.float "rural_zone"
    t.float "nounivtrip"
    t.float "visitor_sh"
    t.text "taz_descri"
    t.float "f2005_taz"
    t.float "salinas_su"
    t.text "bg"
    t.float "hhp1"
    t.float "hhp2"
    t.float "hhp3"
    t.float "hhp4"
    t.float "hhp5"
    t.float "hh1"
    t.float "hh2"
    t.float "hh3"
    t.float "hh4"
    t.float "hh5"
    t.float "hhveh0"
    t.float "hhveh1"
    t.float "hhveh2"
    t.float "hhveh3"
    t.float "hhinc1"
    t.float "hhinc2"
    t.float "hhinc3"
    t.float "hhinc4"
    t.float "hhinc5"
    t.float "hhinc6"
    t.float "hhinc7"
    t.float "workers"
    t.float "nonworkers"
    t.float "daypark"
    t.float "hourpark"
    t.geometry "geometry", limit: {:srid=>4269, :type=>"geometry"}
    t.index ["geometry"], name: "idx_AMBAG_2015_TAZ_geometry", using: :gist
  end

  create_table "ca_place", primary_key: "gid", id: :serial, force: :cascade do |t|
    t.string "geoid"
    t.string "placens"
    t.string "namelsad"
    t.geometry "geom", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.index ["geom"], name: "ca_place_geom_idx", using: :gist
  end

  create_table "census2020tracts_poly", primary_key: "ogc_fid", id: :serial, force: :cascade do |t|
    t.decimal "objectid", precision: 9
    t.string "statefp", limit: 80
    t.string "countyfp", limit: 80
    t.string "tractce", limit: 80
    t.string "geoid", limit: 80
    t.string "name", limit: 80
    t.string "namelsad", limit: 80
    t.string "mtfcc", limit: 80
    t.string "funcstat", limit: 80
    t.decimal "aland", precision: 38, scale: 8
    t.decimal "awater", precision: 38, scale: 8
    t.string "intptlat", limit: 80
    t.string "intptlon", limit: 80
    t.string "shape", limit: 254
    t.geometry "wkb_geometry", limit: {:srid=>26986, :type=>"multi_polygon"}
    t.index ["wkb_geometry"], name: "census2020tracts_poly_wkb_geometry_geom_idx", using: :gist
  end

  create_table "counties_polym", primary_key: "geoid", id: :string, force: :cascade do |t|
    t.string "countyns"
    t.string "county"
    t.string "namelsad"
    t.geometry "shape", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.index ["shape"], name: "counties_polym_shape_idx", using: :gist
  end

  create_table "developments", force: :cascade do |t|
    t.integer "user_id"
    t.boolean "rdv"
    t.boolean "asofright"
    t.boolean "ovr55"
    t.boolean "clusteros"
    t.boolean "phased"
    t.boolean "stalled"
    t.string "name"
    t.string "status"
    t.text "descr"
    t.string "prj_url"
    t.string "address"
    t.string "state", default: "CA"
    t.string "zip_code"
    t.integer "year_compl"
    t.integer "prjarea"
    t.integer "singfamhu"
    t.integer "hu"
    t.integer "gqpop"
    t.integer "rptdemp"
    t.integer "commsf"
    t.integer "hotelrms"
    t.bigint "total_cost"
    t.float "ret_sqft"
    t.float "ofcmd_sqft"
    t.float "indmf_sqft"
    t.float "whs_sqft"
    t.float "rnd_sqft"
    t.float "ei_sqft"
    t.float "other_sqft"
    t.float "hotel_sqft"
    t.float "other_rate"
    t.float "affordable"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "parcel_id"
    t.boolean "mixed_use"
    t.geometry "point", limit: {:srid=>4326, :type=>"st_point"}
    t.string "programs"
    t.boolean "forty_b"
    t.boolean "residential"
    t.boolean "commercial"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "municipal"
    t.string "devlper"
    t.boolean "yrcomp_est"
    t.integer "units_1bd"
    t.integer "units_2bd"
    t.integer "units_3bd"
    t.integer "affrd_unit"
    t.integer "aff_50_80"
    t.boolean "headqtrs"
    t.string "park_type"
    t.integer "publicsqft"
    t.integer "unknownhu"
    t.integer "aff_unknown"
    t.integer "unk_sqft"
    t.bigint "loc_id"
    t.integer "parcel_fy"
    t.string "rpa_name"
    t.string "county"
    t.string "nhood"
    t.text "n_transit", default: [], array: true
    t.boolean "flag", default: false, null: false
    t.datetime "deleted_at"
    t.string "traffic_count_data"
    t.boolean "proj_id_present"
    t.boolean "traffic_count_data_present"
    t.integer "taz"
    t.string "apn"
    t.boolean "trunc"
    t.integer "percomp_24"
    t.integer "percomp_28"
    t.integer "percomp_35"
    t.integer "percomp_45"
    t.text "gluc"
    t.text "placetype"
    t.text "mixeduse_desc"
    t.integer "aff_u50"
    t.integer "aff_80_120"
    t.integer "aff_120p"
    t.integer "multifam"
    t.integer "proj_id"
    t.text "stat_comts"
    t.text "mix_descr"
    t.text "notes"
    t.index ["deleted_at"], name: "index_developments_on_deleted_at"
  end

  create_table "edits", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "development_id"
    t.json "proposed_changes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "approved", default: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_edits_on_deleted_at"
    t.index ["development_id"], name: "index_edits_on_development_id"
    t.index ["user_id"], name: "index_edits_on_user_id"
  end

  create_table "flags", force: :cascade do |t|
    t.string "reason"
    t.boolean "is_resolved"
    t.bigint "development_id"
    t.bigint "user_id"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_flags_on_deleted_at"
    t.index ["development_id"], name: "index_flags_on_development_id"
    t.index ["user_id"], name: "index_flags_on_user_id"
  end

  create_table "neighborhoods_poly", primary_key: "gid", id: :serial, force: :cascade do |t|
    t.string "nhood_name"
    t.geometry "shape", limit: {:srid=>4326, :type=>"multi_polygon"}
    t.index ["shape"], name: "neighborhoods_poly_shape_idx", using: :gist
  end

  create_table "parcels", primary_key: "gid", id: :serial, force: :cascade do |t|
    t.decimal "objectid", precision: 10
    t.string "muni"
    t.string "poly_typ", limit: 18
    t.string "site_addr", limit: 80
    t.string "addr_zip", limit: 12
    t.geometry "geom", limit: {:srid=>4326, :type=>"multi_polygon"}
    t.json "geojson"
    t.string "apn"
    t.string "agency"
    t.index ["apn"], name: "parcels_apn_idx", where: "((COALESCE(apn, ''::character varying))::text <> ''::text)"
    t.index ["geom"], name: "parcels_geom_idx", using: :gist
  end

  create_table "rpa_poly", primary_key: "rpa_id", id: :serial, force: :cascade do |t|
    t.string "rpa_name"
    t.string "acronym"
    t.string "website"
    t.geometry "shape", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.index ["shape"], name: "rpa_poly_shape_idx", using: :gist
  end

  create_table "tazs", id: :serial, force: :cascade do |t|
    t.integer "taz_number"
    t.geometry "geometry", limit: {:srid=>4269, :type=>"multi_polygon"}
    t.index ["geometry"], name: "tazs_geom_idx", using: :gist
  end

  create_table "tod_service_area_poly", primary_key: "gid", id: :serial, force: :cascade do |t|
    t.string "srvc_name"
    t.geometry "geom", limit: {:srid=>4326, :type=>"multi_polygon"}
    t.index ["geom"], name: "tod_service_area_poly_geom_idx", using: :gist
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 3
    t.string "authentication_token"
    t.string "first_name"
    t.string "last_name"
    t.string "municipality"
    t.boolean "request_verified_status", default: false
    t.string "agency"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "developments", "users"
  add_foreign_key "edits", "developments"
  add_foreign_key "edits", "users"
  add_foreign_key "flags", "developments"
  add_foreign_key "flags", "users"
end
