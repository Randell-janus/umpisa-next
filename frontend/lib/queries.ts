import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        fullName
        role
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      fullName
      role
    }
  }
`;

export const MY_LEAVES_QUERY = gql`
  query MyLeaves {
    myBalances {
      id
      leaveType
      allocatedDays
      usedDays
      remainingDays
    }
    myLeaveRequests {
      id
      leaveType
      startDate
      endDate
      days
      reason
      status
      createdAt
    }
  }
`;

export const MY_BALANCES_QUERY = gql`
  query MyBalances {
    myBalances {
      id
      leaveType
      allocatedDays
      usedDays
      remainingDays
    }
  }
`;

export const LEAVE_REQUEST_QUERY = gql`
  query LeaveRequest($id: ID!) {
    leaveRequest(id: $id) {
      id
      leaveType
      startDate
      endDate
      days
      reason
      status
      createdAt
      managerNote
      reviewedAt
      employee {
        id
        fullName
      }
      reviewedBy {
        fullName
      }
      balance {
        remainingDays
      }
    }
  }
`;

export const FILE_LEAVE_MUTATION = gql`
  mutation FileLeave($leaveType: LeaveType!, $startDate: Date!, $endDate: Date!, $reason: String!) {
    fileLeave(leaveType: $leaveType, startDate: $startDate, endDate: $endDate, reason: $reason) {
      leaveRequest {
        id
      }
    }
  }
`;

export const TEAM_LEAVE_REQUESTS_QUERY = gql`
  query TeamLeaveRequests($status: LeaveStatus!) {
    teamLeaveRequests(status: $status) {
      id
      leaveType
      startDate
      endDate
      days
      reason
      status
      createdAt
      employee {
        id
        fullName
      }
    }
  }
`;

export const APPROVE_LEAVE_MUTATION = gql`
  mutation ApproveLeave($id: ID!, $note: String) {
    approveLeave(id: $id, note: $note) {
      leaveRequest {
        id
      }
    }
  }
`;

export const REJECT_LEAVE_MUTATION = gql`
  mutation RejectLeave($id: ID!, $note: String) {
    rejectLeave(id: $id, note: $note) {
      leaveRequest {
        id
      }
    }
  }
`;
