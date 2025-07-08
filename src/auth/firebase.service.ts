import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../common/logger.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      this.logger.log('Iniciando configuración de Firebase...');
      
      // firebase config desde variables de entorno
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
      
      // debug de variables
      this.logger.log(`Project ID: ${projectId ? 'configurado' : 'FALTA'}`);
      this.logger.log(`Client Email: ${clientEmail ? 'configurado' : 'FALTA'}`);
      this.logger.log(`Private Key: ${privateKey ? 'configurado' : 'FALTA'}`);
      
      if (!projectId || !privateKey || !clientEmail) {
        this.logger.error('Firebase no configurado - faltan variables de entorno');
        this.logger.error(`Falta: ${!projectId ? 'PROJECT_ID ' : ''}${!privateKey ? 'PRIVATE_KEY ' : ''}${!clientEmail ? 'CLIENT_EMAIL' : ''}`);
        return;
      }

      const serviceAccount = {
        projectId: projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail: clientEmail,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });

      console.log('firebase ok');
    } catch (error) {
      this.logger.error('Error inicializando Firebase', error.message);
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; uid?: string; email?: string; error?: string }> {
    try {
      if (!admin.apps.length) {
        return { valid: false, error: 'Firebase no está configurado' };
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      
      
      
      return {
        valid: true,
        uid: decodedToken.uid,
        email: decodedToken.email
      };
    } catch (error) {
      this.logger.error('Error validando token Firebase', error.message);
      
      if (error.code === 'auth/id-token-expired') {
        return { valid: false, error: 'Token expirado' };
      }
      
      if (error.code === 'auth/invalid-id-token') {
        return { valid: false, error: 'Token inválido' };
      }
      
      return { valid: false, error: 'Error auth' };
    }
  }
} 