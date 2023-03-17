import React, { useContext } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
// import './Logs.css';
import { useActivityLog } from './../ActivityLogContext';


interface LogItem {
  latitude: number;
  longitude: number;
  activity: string;
}

interface LogsProps {
  logs: LogItem[];
}

const Logs: React.FC = () => {
    const { logs } = useActivityLog();
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Activity Logs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {logs.map((log, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>Activity: {log.activity}</h2>
                  <p>Latitude: {log.latitude}</p>
                  <p>Longitude: {log.longitude}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    );
  };
  

export default Logs;
