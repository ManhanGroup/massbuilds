class GeoPlaceSerializer
  include FastJsonapi::ObjectSerializer
  set_type :place

  
  belongs_to :county
  belongs_to :rpa

  [:id, :namelsad, :county_id,:geojson].each { |attr| attribute attr }

  
end
