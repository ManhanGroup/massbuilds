class CountySerializer < ActiveModel::Serializer
  # include FastJsonapi::ObjectSerializer
  # set_type :county
  attributes :id, :geoid, :county, :namelsad, :ispublic
  belongs_to :rpa
  has_many :places
end
