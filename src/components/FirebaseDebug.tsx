import React, { useState, useEffect } from 'react';
import { db, shouldUseFirebase } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const FirebaseDebug: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [lastTest, setLastTest] = useState<string>('');
  const [firebaseProducts, setFirebaseProducts] = useState<any[]>([]);

  const testFirebaseConnection = async () => {
    setConnectionStatus('checking');
    setLastTest(new Date().toLocaleTimeString());
    
    try {
      console.log('🔥 Test Firebase connection...');
      console.log('🔥 shouldUseFirebase():', shouldUseFirebase());
      console.log('🔥 db object:', !!db);
      
      if (!shouldUseFirebase()) {
        setConnectionStatus('disconnected');
        return;
      }

      // Try to read products collection
      const querySnapshot = await getDocs(collection(db, 'products'));
      const count = querySnapshot.size;

      // Get product details
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Sans titre',
        createdAt: doc.data().createdAt
      }));

      console.log('🔥 Firebase products count:', count);
      console.log('🔥 Firebase products details:', products);
      setProductsCount(count);
      setFirebaseProducts(products);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('❌ Firebase test failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const testDeleteFirstProduct = async () => {
    if (firebaseProducts.length === 0) {
      toast.error("Aucun produit à supprimer");
      return;
    }

    const productToDelete = firebaseProducts[0];
    console.log('🧪 Test suppression directe du produit:', productToDelete);

    try {
      const docRef = doc(db, 'products', productToDelete.id);
      console.log('🧪 Document ref path:', docRef.path);

      await deleteDoc(docRef);
      console.log('🧪 Suppression directe réussie!');
      toast.success(`Produit "${productToDelete.title}" supprimé via test direct`);

      // Refresh
      await testFirebaseConnection();
    } catch (error: any) {
      console.error('🧪 Test suppression échoué:', error);
      toast.error(`Test suppression échoué: ${error.message}`);
    }
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <Card className="border-gray-800 bg-gray-900/50 mb-4">
      <CardHeader>
        <CardTitle className="text-sm text-white flex items-center justify-between">
          Firebase Debug Status
          <div className="space-x-2">
            <Button size="sm" onClick={testFirebaseConnection} className="text-xs">
              Refresh
            </Button>
            {firebaseProducts.length > 0 && (
              <Button size="sm" onClick={testDeleteFirstProduct} className="text-xs bg-red-600 hover:bg-red-700">
                Test Delete First
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Status:</span>
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            {connectionStatus === 'checking' ? 'Testing...' : 
             connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Mode:</span>
          <Badge variant="outline">
            {shouldUseFirebase() ? 'Firebase' : 'localStorage'}
          </Badge>
        </div>
        
        {productsCount !== null && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Firebase Products:</span>
            <Badge variant="outline">{productsCount}</Badge>
          </div>
        )}
        
        {lastTest && (
          <div className="text-xs text-gray-500">
            Last test: {lastTest}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
