class RpasController < ApplicationController
  def index
    if params[:id]
      @rpa= Rpa.find(params[:id])
    else
      @rpas = Rpa
        .select('id, name, acronym, ispublic')
        .where("id in (1,2,12,14,18)")
    end
    respond_to do |format|
      format.jsonapi { render jsonapi: @rpas }
      format.all { render json: @rpas }
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
    #rpa_params[:ispublic]
    
    # Find all development records by RPA name
    @developments = Development.where(rpa_name: rpa_params[:name])

    # Update the column with the new value for all records
    puts rpa_params[:ispublic]
    @developments.update_all(:ispublic => rpa_params[:ispublic])


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
