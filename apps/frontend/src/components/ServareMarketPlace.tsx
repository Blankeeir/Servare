// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { useConnectWallet } from '@web3-onboard/react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Button } from './theme/button';
// import { Input } from '@/components/ui/input';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Loader2 } from 'lucide-react';

// const ServareMarketplace = () => {
//   const [{ wallet }, connect] = useConnectWallet();
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState<Array<{
//     id: number;
//     name: string;
//     quantity: string;
//     location: string;
//     price: string;
//     expiryDate: string;
//   }>>([]);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     description: '',
//     quantity: '',
//     location: '',
//     expiryDate: '',
//     productionDate: '',
//     category: '',
//     imageURI: '',
//     price: ''
//   });

//   useEffect(() => {
//     if (wallet) {
//       loadProducts();
//     }
//   }, [wallet]);

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       // Implementation would connect to VeChain network and load products
//       // This is a placeholder for demonstration
//       const mockProducts = [
//         {
//           id: 1,
//           name: "Organic Apples",
//           quantity: "100 kg",
//           location: "California, USA",
//           price: "0.5 VET",
//           expiryDate: "2024-12-31"
//         }
//       ];
//       setProducts(mockProducts);
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProduct = async () => {
//     try {
//       setLoading(true);
//       // Implementation would mint NFT on VeChain
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate blockchain transaction
//       setIsCreateModalOpen(false);
//       loadProducts();
//     } catch (error) {
//       console.error('Error creating product:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuy = async (productId) => {
//     try {
//       setLoading(true);
//       // Implementation would execute purchase on VeChain
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate blockchain transaction
//       loadProducts();
//     } catch (error) {
//       console.error('Error purchasing product:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Surfood Marketplace</h1>
//         {!wallet ? (
//           <Button onClick={() => connect()}>Connect Wallet</Button>
//         ) : (
//           <Button onClick={() => setIsCreateModalOpen(true)}>List New Product</Button>
//         )}
//       </div>

//       {loading && (
//         <div className="flex justify-center">
//           <Loader2 className="animate-spin" />
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {products.map((product) => (
//           <Card key={product.id}>
//             <CardHeader>
//               <h2 className="text-xl font-semibold">{product.name}</h2>
//             </CardHeader>
//             <CardContent>
//               <p>Quantity: {product.quantity}</p>
//               <p>Location: {product.location}</p>
//               <p>Price: {product.price}</p>
//               <p>Expires: {product.expiryDate}</p>
//               <Button 
//                 className="mt-4"
//                 onClick={() => handleBuy(product.id)}
//                 disabled={!wallet}
//               >
//                 Buy Now
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>List New Food Product</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Input
//               placeholder="Product Name"
//               value={newProduct.name}
//               onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//             />
//             <Input
//               placeholder="Description"
//               value={newProduct.description}
//               onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
//             />
//             <Input
//               placeholder="Quantity"
//               value={newProduct.quantity}
//               onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
//             />
//             <Input
//               placeholder="Location"
//               value={newProduct.location}
//               onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
//             />
//             <Input
//               type="date"
//               placeholder="Expiry Date"
//               value={newProduct.expiryDate}
//               onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
//             />
//             <Input
//               placeholder="Price (VET)"
//               value={newProduct.price}
//               onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//             />
//             <Button onClick={handleCreateProduct} disabled={loading}>
//               {loading ? <Loader2 className="animate-spin" /> : 'Create Listing'}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ServareMarketplace;