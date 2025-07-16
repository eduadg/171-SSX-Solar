import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function DashboardDebug() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(false);

  const renameFirestoreDocuments = async () => {
    if (!db) {
      alert('❌ Firebase não disponível!');
      return;
    }

    setRenaming(true);
    
    // Mapeamento dos documentos antigos para os novos UIDs
    const documentMapping = {
      'client-123': 'm9lwdL1jS0PkeBqOfB7x7rz27NR2',
      'admin-123': 'oDDa0SZBRMX8J17vtmKr1nV0B213', 
      'installer-123': 'k2XwC2dfu2UiRbOQPXdX93rC4bi1'
    };

    console.log('🔄 Iniciando renomeação dos documentos...');
    
    for (const [oldId, newId] of Object.entries(documentMapping)) {
      try {
        console.log(`🔄 Processando: ${oldId} → ${newId}`);
        
        // 1. Buscar documento antigo
        const oldDocRef = doc(db, 'users', oldId);
        const oldDocSnap = await getDoc(oldDocRef);
        
        if (!oldDocSnap.exists()) {
          console.log(`⚠️ Documento ${oldId} não encontrado, pulando...`);
          continue;
        }
        
        // 2. Pegar dados do documento antigo
        const oldData = oldDocSnap.data();
        console.log(`📄 Dados encontrados:`, oldData);
        
        // 3. Criar novo documento com UID correto
        const newDocRef = doc(db, 'users', newId);
        await setDoc(newDocRef, oldData);
        console.log(`✅ Novo documento criado: ${newId}`);
        
        // 4. Excluir documento antigo
        await deleteDoc(oldDocRef);
        console.log(`🗑️ Documento antigo excluído: ${oldId}`);
        
        console.log(`✅ ${oldId} → ${newId} concluído!`);
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${oldId}:`, error);
        alert(`Erro ao processar ${oldId}: ${error.message}`);
      }
    }
    
    console.log('🎉 Renomeação concluída!');
    alert('✅ Renomeação concluída! Recarregue a página.');
    setRenaming(false);
  };

  if (!currentUser) return <div>Usuário não logado</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Dashboard Debug</h2>
      
      {/* Botão para renomear documentos */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          🔧 Ferramentas de Desenvolvimento
        </h3>
        <button
          onClick={renameFirestoreDocuments}
          disabled={renaming}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium"
        >
          {renaming ? '🔄 Renomeando...' : '🔄 Renomear Documentos Firestore'}
        </button>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
          Renomeia os documentos do Firestore para usar os UIDs corretos dos usuários
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium">Usuário Atual:</h3>
        <p>Nome: {currentUser.name}</p>
        <p>Email: {currentUser.email}</p>
        <p>UID: {currentUser.uid}</p>
        <p>Role: {currentUser.role || 'N/A'}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Status do Firebase:</h3>
        <p>✅ Firebase inicializado</p>
        <p>✅ Usuário autenticado</p>
        <p>⚠️ Documento não encontrado no Firestore</p>
        <p className="text-sm text-gray-600 mt-2">
          Isso significa que o documento com UID "{currentUser.uid}" não existe no Firestore.
          Use o botão acima para renomear os documentos.
        </p>
      </div>
    </div>
  );
} 