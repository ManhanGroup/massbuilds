class RpasController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  def index
    if params[:id]
      @rpa= Rpa.find(params[:id])
    elsif params[:Lat] && params[:Lng]
      @rpas=Rpa.where("ST_Contains(shape, st_transform(ST_SetSRID(ST_MakePoint(#{params[:Lng]}, #{params[:Lat]}), 4326),4269))").first
    else
      @rpas = Rpa
        .select('id, name, acronym, ispublic')
        .where("id in (1,2,12,14,18)")
        .order(:name)
    end
    respond_to do |format|
      format.jsonapi { render jsonapi: @rpas,  status: :ok }
      format.all { render json: @rpas,  status: :ok }
    end
  end

  def show
    respond_to do |format|
      format.jsonapi { render jsonapi: @rpa }
    end
  end

  # PATCH/PUT /rpas/1
  def update
    puts "test rpaparams"
    puts rpa_params
    @rpa= Rpa.find(rpa_params[:id])
    @rpa.update(rpa_params)  
    
    respond_to do |format|
      format.jsonapi { render jsonapi: @rpa }
    end 
       
  end

 
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rpa
      @rpa = Rpa.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def rpa_params
      # TODO: Figure out how to permit filter params when calling index.
      # Typical rails approach: params.permit(filter: [:approved])
      respond_to do |format|
        format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:id,:ispublic, :name]) }
      end
    end
  
end
