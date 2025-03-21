document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const ageInput = document.getElementById('age');
  const genderSelect = document.getElementById('gender');
  const weightInput = document.getElementById('weight');
  const metersInput = document.getElementById('meters');
  const unitBtns = document.querySelectorAll('.unit-btn');
  const feetInput = document.getElementById('feet');
  const inchesInput = document.getElementById('inches');
  const showFactorsBtn = document.getElementById('showFactorsBtn');
  const factorsContent = document.getElementById('factorsContent');
  const calculateBtn = document.getElementById('calculateBtn');
  const resultsSection = document.getElementById('results');
  
  // 显示/隐藏额外因素
  showFactorsBtn.addEventListener('click', () => {
    if (factorsContent.style.display === 'none') {
      factorsContent.style.display = 'block';
      showFactorsBtn.innerHTML = 'Hide Additional Factors <span class="dropdown-icon">▲</span>';
      
      // 添加额外因素的表单元素
      factorsContent.innerHTML = `
        <div class="form-row">
          <div class="form-group">
            <label for="activity">Activity Level</label>
            <select id="activity">
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light" selected>Lightly active (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="active">Active (hard exercise 6-7 days/week)</option>
              <option value="very_active">Very active (very hard exercise & physical job)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="bodyType">Body Frame</label>
            <select id="bodyType">
              <option value="small">Small</option>
              <option value="medium" selected>Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="waist">Waist Circumference (cm)</label>
            <input type="number" id="waist" placeholder="Enter waist measurement" min="40" max="200">
          </div>
          <div class="form-group">
            <label for="neck">Neck Circumference (cm)</label>
            <input type="number" id="neck" placeholder="Enter neck measurement" min="20" max="80">
          </div>
        </div>
      `;
    } else {
      factorsContent.style.display = 'none';
      showFactorsBtn.innerHTML = 'Show Additional Factors for More Accuracy <span class="dropdown-icon">▼</span>';
    }
  });
  
  // 单位切换逻辑
  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.dataset.unit;
      const feetInputs = document.querySelector('.feet-input');
      const metersInputs = document.querySelector('.meters-input');
      
      // 更新按钮状态
      unitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 切换输入框显示
      if (unit === 'feet') {
        feetInputs.style.display = 'flex';
        metersInputs.style.display = 'none';
        // 如果有米的值，转换为英尺和英寸
        if (metersInput.value) {
          const totalInches = metersInput.value * 39.3701;
          feetInput.value = Math.floor(totalInches / 12);
          inchesInput.value = Math.round(totalInches % 12);
        }
      } else {
        feetInputs.style.display = 'none';
        metersInputs.style.display = 'flex';
        // 如果有英尺和英寸的值，转换为米
        if (feetInput.value && inchesInput.value) {
          const totalInches = (parseInt(feetInput.value) * 12) + parseInt(inchesInput.value);
          metersInput.value = (totalInches * 0.0254).toFixed(2);
        }
      }
    });
  });
  
  // 计算BMI和健康因素
  calculateBtn.addEventListener('click', () => {
      if (!validateInputs()) {
        return;
      }
      
      const age = parseInt(ageInput.value);
      const gender = genderSelect.value;
      const weight = parseFloat(weightInput.value);
      
      // 获取身高（米）
      let heightInMeters = 0;
      const activeUnit = document.querySelector('.unit-btn.active').dataset.unit;
      
      if (activeUnit === 'feet') {
        if (feetInput.value && inchesInput.value) {
          const feet = parseInt(feetInput.value);
          const inches = parseInt(inchesInput.value);
          const totalInches = (feet * 12) + inches;
          heightInMeters = totalInches * 0.0254;
        }
      } else {
        if (metersInput.value) {
          heightInMeters = parseFloat(metersInput.value);
        }
      }
      
      if (!heightInMeters) {
        alert('请输入有效的身高数据');
        return;
      }
      
      // 计算BMI
      const bmi = weight / (heightInMeters * heightInMeters);
      
      // 确定BMI类别
      let category = '';
      let categoryColor = '';
      
      if (bmi < 18.5) {
        category = '体重过轻';
        categoryColor = '#3498db'; // 蓝色
      } else if (bmi < 24.9) {
        category = '健康体重';
        categoryColor = '#2ecc71'; // 绿色
      } else if (bmi < 29.9) {
        category = '超重';
        categoryColor = '#f39c12'; // 橙色
      } else {
        category = '肥胖';
        categoryColor = '#e74c3c'; // 红色
      }
      
      // 显示结果
      resultsSection.style.display = 'block';
      resultsSection.innerHTML = `
        <h2>您的BMI结果</h2>
        <div class="bmi-result">
          <div class="bmi-value">${bmi.toFixed(1)}</div>
          <div class="bmi-category" style="color: ${categoryColor}">${category}</div>
        </div>
        <div class="bmi-scale">
          <div class="scale-bar">
            <div class="scale-marker" style="left: ${Math.min(100, Math.max(0, (bmi - 10) * 3))}%"></div>
            <div class="scale-segments">
              <div class="segment segment-1">体重过轻</div>
              <div class="segment segment-2">健康体重</div>
              <div class="segment segment-3">超重</div>
              <div class="segment segment-4">肥胖</div>
            </div>
          </div>
        </div>
        <div class="health-insights">
          <h3>健康见解</h3>
          <p>基于您的BMI ${bmi.toFixed(1)} (${category})，以下是一些健康建议：</p>
          <ul>
            ${getHealthRecommendations(bmi, age, gender)}
          </ul>
        </div>
      `;
      
      // 添加额外的CSS样式
      const style = document.createElement('style');
      style.textContent = `
        .bmi-result {
          text-align: center;
          margin: 20px 0;
        }
        .bmi-value {
          font-size: 3rem;
          font-weight: bold;
          color: #333;
        }
        .bmi-category {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 5px;
        }
        .bmi-scale {
          margin: 30px 0;
        }
        .scale-bar {
          position: relative;
          height: 20px;
          background: linear-gradient(to right, #3498db, #2ecc71, #f39c12, #e74c3c);
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .scale-marker {
          position: absolute;
          width: 12px;
          height: 30px;
          background-color: #333;
          border-radius: 6px;
          top: -5px;
          transform: translateX(-50%);
        }
        .scale-segments {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 14px;
        }
        .health-insights {
          margin-top: 30px;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .health-insights h3 {
          margin-top: 0;
          color: #333;
        }
        .health-insights ul {
          padding-left: 20px;
        }
        .health-insights li {
          margin-bottom: 10px;
        }
      `;
      document.head.appendChild(style);
    });
    
    // 更新验证函数
    function validateInputs() {
      if (!ageInput.value) {
        alert('请输入年龄');
        return false;
      }
      if (!genderSelect.value) {
        alert('请选择性别');
        return false;
      }
      if (!weightInput.value) {
        alert('请输入体重');
        return false;
      }
      
      const activeUnit = document.querySelector('.unit-btn.active').dataset.unit;
      if (activeUnit === 'feet' && (!feetInput.value || !inchesInput.value)) {
        alert('请输入完整的身高信息（英尺和英寸）');
        return false;
      } else if (activeUnit === 'meters' && !metersInput.value) {
        alert('请输入身高（米）');
        return false;
      }
      return true;
    }
    
    // 获取健康建议
    function getHealthRecommendations(bmi, age, gender) {
      let recommendations = '';
      
      if (bmi < 18.5) {
        recommendations += '<li>考虑增加每日热量摄入，选择富含健康脂肪和蛋白质的食物。</li>';
        recommendations += '<li>咨询医生或营养师，制定健康增重计划。</li>';
        recommendations += '<li>进行力量训练，帮助增加肌肉质量。</li>';
      } else if (bmi < 24.9) {
        recommendations += '<li>继续保持健康的饮食和运动习惯。</li>';
        recommendations += '<li>每周进行至少150分钟的中等强度有氧运动。</li>';
        recommendations += '<li>确保摄入均衡的营养，包括足够的蔬菜、水果、全谷物和蛋白质。</li>';
      } else if (bmi < 29.9) {
        recommendations += '<li>适当减少每日热量摄入，增加体力活动。</li>';
        recommendations += '<li>选择低热量、高营养的食物，如蔬菜、水果和瘦肉。</li>';
        recommendations += '<li>每周进行至少150-300分钟的中等强度有氧运动。</li>';
      } else {
        recommendations += '<li>咨询医生或营养师，制定个性化的减重计划。</li>';
        recommendations += '<li>逐步增加体力活动，从轻度运动开始，如步行。</li>';
        recommendations += '<li>关注饮食质量，减少加工食品和糖的摄入。</li>';
        recommendations += '<li>定期监测健康指标，如血压和血糖。</li>';
      }
      
      // 根据年龄添加建议
      if (age > 50) {
        recommendations += '<li>定期进行骨密度检查，特别是对于女性。</li>';
        recommendations += '<li>确保摄入足够的钙和维生素D，维持骨骼健康。</li>';
      }
      
      // 根据性别添加建议
      if (gender === 'female') {
        recommendations += '<li>女性应特别关注铁和叶酸的摄入，尤其是在生育年龄。</li>';
      } else if (gender === 'male') {
        recommendations += '<li>男性应关注心脏健康，定期检查血压和胆固醇水平。</li>';
      }
      
      return recommendations;
    }
});