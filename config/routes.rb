KarmaTracker::Application.routes.draw do

  namespace :api, defaults: {format: 'json'} do
    namespace :v1 do

      resources :users do
        collection do
          get :me
          get :authenticate
        end
      end

    end
  end

end
