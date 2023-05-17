class ParcelSerializer < ActiveModel::Serializer
  attributes :gid, :geojson, :muni, :apn, :poly_typ, :site_addr
end
