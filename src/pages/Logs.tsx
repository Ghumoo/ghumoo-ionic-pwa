import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { useActivityLog } from '../contexts/ActivityLogContext';

const Logs: React.FC = () => {
  const { logs } = useActivityLog();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Activity Logs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {logs.map((log, index) => (
            <IonItem key={index}>
              <IonLabel>
                Lat: {log.latitude.toFixed(6)}, Lng: {log.longitude.toFixed(6)}, Activity: {log.activity}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Logs;
