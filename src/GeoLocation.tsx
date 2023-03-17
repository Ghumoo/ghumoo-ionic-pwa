import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './GeoLocation.css';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

const checkAndRequestPermissions = async () => {
  const { location: locationStatus } = await Geolocation.checkPermissions();
  if (locationStatus === 'granted') {
    return true;
  } else {
    const permissionResult = await Geolocation.requestPermissions();
    return permissionResult.location === 'granted';
  }
};



const GeoLocation: React.FC = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const watchLocation = async () => {
      const hasPermission = await checkAndRequestPermissions();
      if (hasPermission) {
        const watchId = Geolocation.watchPosition(
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
          (position, err) => {
            if (position) {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            } else if (err) {
              console.error('Error getting location:', err);
              setError(err.message || 'Unknown error');
            }
          }
        );

        return () => {
          // Clean up the geolocation watch when the component is unmounted
          Geolocation.clearWatch({ id: String(watchId) });
        };
      } else {
        setError('Geolocation permission not granted.');
      }
    };

    watchLocation();
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Live Geolocation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {error ? (
          <IonText>
            <p>Error: {error}</p>
          </IonText>
        ) : (
          <LoadScriptNext
            id="script-loader"
            googleMapsApiKey="AIzaSyCKIvXqQIQT2_HGDiqwmhjAvS_w1J-jLxA"
            loadingElement={<div>Loading...</div>}
            libraries={['geometry', 'drawing', 'places']}
          >
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={15}
            >
              <Marker position={{ lat: location.latitude, lng: location.longitude }} />
            </GoogleMap>
          </LoadScriptNext>
        )}
      </IonContent>



    </IonPage>
  );
};

export default GeoLocation;
