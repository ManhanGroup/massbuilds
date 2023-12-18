class RpaSerializer < ActiveModel::Serializer
  attributes :id, :name, :acronym, :ispublic
  has_many :counties
  has_many :places  
end
