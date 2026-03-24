terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# RDS TimescaleDB Instance matching Hot Layer Spec
resource "aws_db_instance" "timescaledb" {
  identifier             = "cencera-hot-layer-db"
  instance_class         = "db.r6g.2xlarge"
  allocated_storage      = 1000
  engine                 = "postgres"
  engine_version         = "16"
  username               = "cencera"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = false
}

# Elasticache Redis Cluster matching L2 Regional Cache Spec
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "cencera-redis-l2"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# SQS Queue backing up scoring jobs if Redis Bull queue is bypassed
resource "aws_sqs_queue" "scoring_queue" {
  name                      = "cencera-scoring-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
}

# K8s EKS Cluster for worker nodes
resource "aws_eks_cluster" "cencera_workers" {
  name     = "cencera-eks-cluster"
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}
