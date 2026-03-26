import { proposalService } from '../src/services/proposalService';

describe('Proposal Service', () => {
  it('creates a proposal', () => {
    const proposal = proposalService.createProposal({
      title: 'Test Proposal',
      description: 'Testing',
      type: 'UPGRADE',
      author: 'user1',
    });
    expect(proposal.id).toBeDefined();
    expect(proposal.status).toBe('PENDING');
  });

  it('updates a proposal', () => {
    const proposal = proposalService.createProposal({
      title: 'Update Proposal',
      description: 'Testing update',
      type: 'FUNDING',
      author: 'user2',
    });
    const updated = proposalService.updateProposal(proposal.id, { status: 'ACTIVE' });
    expect(updated?.status).toBe('ACTIVE');
  });
});
