import React, { useState } from 'react';
import { proposalService } from '../services/proposalService';
import { ProposalType } from '../types/proposal';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateProposalModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProposalType>('UPGRADE');

  const handleSubmit = () => {
    if (!title || !description) return alert('Title and description are required');
    proposalService.createProposal({ title, description, type, author: 'currentUser' });
    onCreated();
    onClose();
  };

  return (
    <div className="modal">
      <h2>Create Proposal</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <select value={type} onChange={e => setType(e.target.value as ProposalType)}>
        <option value="UPGRADE">Upgrade</option>
        <option value="FUNDING">Funding</option>
        <option value="PARAMETER_CHANGE">Parameter Change</option>
      </select>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
