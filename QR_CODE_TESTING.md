# QR Code Testing Guide

This guide explains how to test the QR code functionality in the VGC Hub application.

## Overview

The QR code system allows players to check into tournaments using secure, time-based QR codes. The system includes:

- **QR Code Generation**: Creates secure, time-limited QR codes for tournament check-in
- **QR Code Scanner**: Camera-based scanner for testing QR codes
- **Real-time Updates**: Check-in status updates across all devices in real-time
- **Check-in History**: Tracks all check-ins for audit purposes

## How to Test

### 1. Access the QR Test Page

1. Log into the application
2. Navigate to the home dashboard
3. Click the "QR Test" button in the Quick Actions section
4. Or directly visit `/qr-test` in your browser

### 2. Generate a Test QR Code

1. On the QR Test page, click "Generate New" to create a fresh QR code
2. The QR code will display with a unique token
3. Note the token format: `SEC_playerId_tournamentId_securityToken`

### 3. Test Real-time Updates

**Method 1: Multiple Devices**
1. Open the QR test page on multiple devices/browsers
2. Generate a QR code on one device
3. Use the "Simulate Check-in" button on another device
4. Watch the check-in status update in real-time across all devices

**Method 2: QR Scanner**
1. Click the "Scan QR Code" button to open the camera scanner
2. Use the "Test Scan" button to simulate scanning a QR code
3. The check-in will be processed and status will update

**Method 3: Direct Check-in**
1. Use the "Simulate Check-in" button to directly check in
2. This bypasses the QR scanning process for testing

### 4. Monitor System Activity

The QR Test page shows:
- **System Statistics**: Active QR codes, check-ins, expired codes, total check-ins
- **Check-in History**: Recent check-ins with timestamps
- **Real-time Status**: Current check-in status with visual indicators

## QR Code Security Features

### Time-based Expiration
- QR codes expire after 1 minute for security
- Automatic refresh every minute
- Expired codes cannot be used for check-in

### Secure Token Generation
- Each QR code has a unique, time-based token
- Tokens include player ID, tournament ID, and security hash
- Prevents QR code theft and reuse

### Real-time Validation
- QR codes are validated server-side
- Check-in status updates immediately across all devices
- Prevents duplicate check-ins

## Testing Scenarios

### Scenario 1: Normal Check-in Flow
1. Generate QR code
2. Scan QR code with camera
3. Verify check-in success
4. Check real-time status update

### Scenario 2: Multiple Device Testing
1. Open QR test page on Device A and Device B
2. Generate QR code on Device A
3. Check-in on Device B
4. Verify status updates on both devices

### Scenario 3: Expired QR Code
1. Generate QR code
2. Wait for expiration (1 minute)
3. Try to check-in
4. Verify rejection due to expiration

### Scenario 4: Duplicate Check-in
1. Generate QR code
2. Check-in successfully
3. Try to check-in again
4. Verify rejection due to already checked in

## API Endpoints (Mock)

The QR code system uses these mock endpoints:

- `POST /api/qr/generate` - Generate new QR code
- `POST /api/qr/validate` - Validate QR code
- `POST /api/qr/checkin` - Process check-in
- `GET /api/qr/status/:token` - Get QR code status
- `GET /api/qr/history/:playerId` - Get check-in history

## Real-time Events

The system uses WebSocket-like events for real-time updates:

- `check-in-processed` - When a check-in is completed
- `qr-code-expired` - When a QR code expires
- `qr-code-refreshed` - When a QR code is refreshed

## Integration with Main App

The QR code system integrates with:

- **Tickets Page** (`/tickets`) - View tournament tickets with QR codes
- **QR Code Generator** - Component for generating and managing QR codes
- **Profile Page** - Shows check-in history and status

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted
- Try refreshing the page
- Use the "Test Scan" button as fallback

### QR Code Not Updating
- Check browser console for errors
- Verify network connection
- Try refreshing the page

### Check-in Not Working
- Verify QR code hasn't expired
- Check if already checked in
- Ensure QR code token is valid

## Development Notes

- All QR codes are stored in memory for demo purposes
- In production, use a database for persistence
- Add proper authentication and authorization
- Implement rate limiting for QR code generation
- Add audit logging for security compliance

## Future Enhancements

- **Offline Support**: QR codes that work without internet
- **Biometric Check-in**: Fingerprint or face recognition
- **Batch Check-in**: Multiple players at once
- **Analytics Dashboard**: Check-in statistics and trends
- **Integration with Tournament Software**: Direct integration with tournament management systems 