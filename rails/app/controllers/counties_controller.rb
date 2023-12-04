class CountiesController < ApplicationController
  def index
    if params[:id]
      @county = County.find(params[:id])
    else
      @county = County.select('id,geoid, county, namelsad, ispublic').where("rpa_id in (1,2,12,14,18)")
    end
    respond_to do |format|
      format.jsonapi { render jsonapi: @county }
    end
  end

  def show
    @county = County.find(params[:id])
    respond_to do |format|
      format.jsonapi { render jsonapi: @county }
    end
  end

  def update
    @county= County.find(county_params[:id])
    @county.update(county_params)  
    puts county_params
    # Find all development records by RPA name
    @developments = Development.where(county: county_params[:county])

    # Update the column with the new value for all records
    @developments.update_all(:ispublic => county_params[:ispublic])

    respond_to do |format|
        format.jsonapi { render jsonapi: @county }
    end       
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_county
      @county = County.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def county_params
      # TODO: Figure out how to permit filter params when calling index.
      # Typical rails approach: params.permit(filter: [:approved])
      respond_to do |format|
        format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:id,:county,:ispublic]) }
      end
    end
  
end
