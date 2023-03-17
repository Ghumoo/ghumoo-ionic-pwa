import { Motion } from '@capacitor/motion';

export const startMotionTracking = async () => {
    try {
        Motion.addListener('accel', (event) => {
            console.log('Accelerometer data:', event);
            // Process the accelerometer data here to detect activities
        });
    } catch (error) {
        console.error('Error starting motion tracking:', error);
    }
};


export const processAccelerometerData = (accelerometerData: any) => {
    const { accelerationIncludingGravity: { x, y, z } } = accelerometerData;

    // Calculate the magnitude of the acceleration vector
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // Set thresholds for different activities
    const stationaryThreshold = 1;
    const walkingThreshold = 15;
    const runningThreshold = 25;

    // Classify the activity based on the magnitude
    let activity = 'unknown';
    if (magnitude < stationaryThreshold) {
        activity = 'stationary';
    } else if (magnitude < walkingThreshold) {
        activity = 'walking';
    } else if (magnitude < runningThreshold) {
        activity = 'running';
    }

    console.log('Detected activity:', activity);
    return activity;
};

