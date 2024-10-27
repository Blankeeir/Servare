import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Grid, Alert } from '@mui/material';
import { useWallet } from '@vechain/dapp-kit-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { uploadToIPFS } from '../utils/ipfs';
import { useContract } from '../hooks/useContract';
import { SERVARE_NFT_ADDRESS } from '../const';
import ServareNFTAbi from '../abi/ServareNFT.json';


