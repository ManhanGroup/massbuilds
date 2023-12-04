class PlaceSerializer < ActiveModel::Serializer
  attributes :id, :namelsad, :ispublic, :geojson
  belongs_to :county
  belongs_to :rpa
end
