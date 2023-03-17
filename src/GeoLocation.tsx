import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonButton } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';
import './GeoLocation.css';
import { GoogleMap, LoadScriptNext, Marker, Polyline, Circle } from '@react-google-maps/api';

import { startMotionTracking, processAccelerometerData } from './MotionTracking';
import { useActivityLog } from './ActivityLogContext';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 0,
  lng: 0,
};

const getActivityColor = (activity: string) => {
  switch (activity) {
    case 'stationary':
      return '#0000FF';
    case 'walking':
      return '#008000';
    case 'running':
      return '#FF0000';
    default:
      return '#000000';
  }
};

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
  const [paths, setPaths] = useState<{ [key: string]: any[] }>({});
  const [prevActivity, setPrevActivity] = useState('');
  const { addLog } = useActivityLog();

  const updatePaths = (latLng: any, activity: string) => {
    setPaths((prevPaths) => {
      const updatedPaths = { ...prevPaths };
      if (updatedPaths[activity]) {
        updatedPaths[activity].push(latLng);
      } else {
        updatedPaths[activity] = [latLng];
      }
      return updatedPaths;
    });
    if (activity !== prevActivity) {
      console.log(`Activity changed: ${prevActivity} -> ${activity}`);
      addLog({ latitude: latLng.lat, longitude: latLng.lng, activity });
      setPrevActivity(activity);
    }
    else{
      console.log(`Activity unchanged: ${prevActivity} -> ${activity}`);
      addLog({ latitude: latLng.lat, longitude: latLng.lng, activity });
    }
  };

  useEffect(() => {
    const watchLocation = async () => {
      const hasPermission = await checkAndRequestPermissions();
      if (hasPermission) {
        await startMotionTracking();

        const watchId = Geolocation.watchPosition(
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
          (position, err) => {
            if (position) {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              const detectedActivity = processAccelerometerData({ x: 0, y: 0, z: 0 });
              updatePaths({ lat: position.coords.latitude, lng: position.coords.longitude }, detectedActivity);
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
              {Object.entries(paths).map(([activity, path], index) => (
                <Polyline
                  key={index}
                  path={path}
                  options={{
                    strokeColor: getActivityColor(activity),
                    strokeOpacity: 1,
                    strokeWeight: 5,
                  }}
                />
              ))}
              <Circle
                center={{ lat: location.latitude, lng: location.longitude }}
                radius={5}
                options={{
                  fillColor: '#0000FF',
                  fillOpacity: 1,
                  strokeColor: '#0000FF',
                  strokeWeight: 1,
                }}
              />
            </GoogleMap>
          </LoadScriptNext>
        )}
      </IonContent>
      <IonButton routerLink="/logs">View Activity Logs</IonButton>
    </IonPage>
  );
};

export default GeoLocation;

