class ParcelsController < ActionController::Base # ApplicationController
  def index
    @parcel = if params[:lng] && params[:lat]
                Parcel
                .select('gid, geojson, muni, poly_typ, site_addr,apn')
                .where("ST_Contains(geom, ST_SetSRID(ST_MakePoint(#{params[:lng]}, #{params[:lat]}), 4326))")
              else
                Parcel
                .select('gid, geojson, muni, poly_typ, site_addr,apn')
                .where("gid<1000")
              end
    respond_to do |format|
      format.jsonapi { render jsonapi: @parcel }
    end
  end
end
