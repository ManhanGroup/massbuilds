class PlacesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  def index
    if params[:id]
      @place = Place.find(params[:id])
    elsif params[:namelsad]
      @place= Place.where('namelsad ilike',params[:namelsad])
    else
      @places = Place
        .select('id, namelsad, ispublic, county_id, geojson')
        .where("rpa_id in (1,2,12,14,18)")
    end
    respond_to do |format|
      
      format.jsonapi do
        scope = 'zoom2city' if params[:zoom2city]
        if scope == 'zoom2city'
          render json: GeoPlaceSerializer.new(@places).serialized_json
        else
          render render jsonapi: @places
        end
      end
    end
  end

  def show
    @place = Place.find(params[:id])
    respond_to do |format|
      format.jsonapi { render jsonapi: @place }
    end
  end

  def update
    puts params
    puts place_params
    @place= Place.find(place_params[:id])
    @place.update(place_params)

    # Find all development records by RPA name
    @developments = Development.where("municipal ilike ?",place_params[:namelsad])

    # Update the column with the new value for all records
    @developments.update_all(:ispublic => place_params[:ispublic])

    respond_to do |format|
        format.jsonapi { render jsonapi: @place }
    end       
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def place_params
      # TODO: Figure out how to permit filter params when calling index.
      # Typical rails approach: params.permit(filter: [:approved])
      respond_to do |format|
        format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:id,:namelsad,:ispublic]) }
      end
    end
end
