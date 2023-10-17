# frozen_string_literal: true
FactoryBot.define do
  factory :development do
    rdv { false }
    asofright { false }
    ovr55 { false }
    clusteros { false }
    phased { false }
    stalled { false }
    name { 'Seaport' }
    status { 'MyString' }
    descr { 'A sample development' }
    prj_url { 'http://www.example.com/' }
    address { '101 Main Street' }
    state { 'CA' }
    zip_code { '95060' }
    year_compl { 1 }
    prjarea { 1 }
    singfamhu { 1 }
    hu { 1 }
    gqpop { 1 }
    rptdemp { 1 }
    commsf { 1 }
    hotelrms { 1 }
    total_cost { 1 }
    ret_sqft { 1.5 }
    ofcmd_sqft { 1.5 }
    indmf_sqft { 1.5 }
    whs_sqft { 1.5 }
    rnd_sqft { 1.5 }
    ei_sqft { 1.5 }
    other_sqft { 1.5 }
    hotel_sqft { 1.5 }
    other_rate { 1.5 }
    affordable { 1.5 }
    parcel_id { 'MyString' }
    mixed_use { false }
    point { 'POINT(-122.02236744119034 36.96349692940986)' }
    latitude { 36.96349692940986 }
    longitude { -122.02236744119034 } 
    programs { 'MyString' }
    forty_b { false }
    residential { false }
    commercial { false }
    municipal { 'Santa Cruz' }
    devlper { 'Workbench' }
    units_1bd { 1 }
    units_2bd { 1 }
    units_3bd { 1 }
    affrd_unit { false }
    aff_50_80 { 1 }
    headqtrs { false }
    park_type { 'parking' }
    publicsqft { 1 }
    yrcomp_est { '2010' }
    traffic_count_data { 'https://pems.dot.ca.gov' }
  end
end
