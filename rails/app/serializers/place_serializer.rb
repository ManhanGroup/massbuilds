class PlaceSerializer < ActiveModel::Serializer
  #include FastJsonapi::ObjectSerializer
  #set_type :place
  belongs_to :county
  belongs_to :rpa


  attributes :id, :namelsad, :ispublic, :geojson

  
end
